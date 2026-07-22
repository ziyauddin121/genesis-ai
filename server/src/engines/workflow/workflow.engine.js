import workflowRepository from './workflow.repository.js';
import {
  WORKFLOW_STATUS,
  STEP_STATUS,
  LOG_LEVEL,
  WORKFLOW_DEFAULTS,
} from './workflow.constants.js';
import AppError from '../../utils/AppError.js';
import taskAnalyzer from '../../analyzers/task/task-analyzer.js';
import Task from '../../models/task.model.js';
import capabilityEngine from '../capability/capability.engine.js';

class WorkflowEngine {
  /**
   * Private Helper: Retrieve workflow document by ID or object
   */
  async #getWorkflow(idOrWorkflow) {
    if (typeof idOrWorkflow === 'object' && idOrWorkflow._id && typeof idOrWorkflow.save === 'function') {
      return idOrWorkflow;
    }
    const workflowId = typeof idOrWorkflow === 'object' ? idOrWorkflow._id || idOrWorkflow.id : idOrWorkflow;
    const workflow = await workflowRepository.findById(workflowId);
    if (!workflow) {
      throw new AppError(`Workflow not found: ${idOrWorkflow}`, 404);
    }
    return workflow;
  }

  /**
   * Private Helper: Save workflow document natively
   */
  async #save(workflow) {
    return workflow.save();
  }

  /**
   * Private Helper: Find step by stepId inside workflow
   */
  #findStep(workflow, stepId) {
    return workflow.steps.find((step) => step.id === stepId);
  }

  /**
   * Private Helper: Ensure workflow is active and not already finished
   */
  #ensureActive(workflow) {
    if (
      workflow.status === WORKFLOW_STATUS.COMPLETED ||
      workflow.status === WORKFLOW_STATUS.CANCELLED ||
      workflow.status === WORKFLOW_STATUS.FAILED
    ) {
      throw new AppError(
        `Workflow ${workflow._id} is already finished with status '${workflow.status}'`,
        400
      );
    }
  }

  /**
   * Start workflow initialization for a task
   */
  async start(task) {
    const taskId = typeof task === 'object' ? task._id || task.id : task;

    let workflow = await workflowRepository.findByTaskId(taskId);
    
    // Idempotency: Return existing workflow if already started
    if (workflow) {
      return workflow;
    }

    workflow = await workflowRepository.create({
      task: taskId,
      status: WORKFLOW_STATUS.PLANNING,
      progress: WORKFLOW_DEFAULTS.PROGRESS,
      currentStep: WORKFLOW_DEFAULTS.CURRENT_STEP,
      startedAt: new Date(),
      logs: [
        {
          level: LOG_LEVEL.INFO,
          message: 'Workflow execution initialized',
          createdAt: new Date(),
        },
      ],
    });

    // Trigger workflow orchestration asynchronously (execute handles failure internally)
    this.execute(workflow).catch(console.error);

    return workflow;
  }

  /**
   * Orchestrate workflow execution pipeline
   */
  async execute(workflowInput) {
    const workflow = await this.#getWorkflow(workflowInput);
    this.#ensureActive(workflow);

    await this.updateStatus(workflow._id, WORKFLOW_STATUS.EXECUTING);
    await this.addLog(
      workflow._id,
      LOG_LEVEL.INFO,
      'Executing workflow pipeline'
    );

    try {
      await this.#plan(workflow);
      await this.#route(workflow);
      await this.#finish(workflow);
    } catch (error) {
      await this.fail(workflow._id, error);
      throw error;
    }
  }

  /**
   * Private Sub-stage: Planning stage
   */
  async #plan(workflow) {
    let task = workflow.task;
    if (task && typeof task === 'object' && !task.title) {
      task = await Task.findById(workflow.task);
    } else if (typeof task !== 'object') {
      task = await Task.findById(workflow.task);
    }

    if (task) {
      const analysis = await taskAnalyzer.analyze(task);
      workflow.analysis = analysis;
      const capName = analysis.capability?.name || analysis.capability?.id || analysis.capability;
      await this.addLog(
        workflow._id,
        LOG_LEVEL.INFO,
        `Task analyzed: capability='${capName}', complexity='${analysis.complexity}'`
      );
    }
  }

  /**
   * Private Sub-stage: Routing & execution stage
   */
  async #route(workflow) {
    if (workflow.analysis) {
      const capName = workflow.analysis.capability?.name || workflow.analysis.capability?.id || workflow.analysis.capability;
      await this.addLog(
        workflow._id,
        LOG_LEVEL.INFO,
        `Routing workflow to capability: '${capName}'`
      );
      const result = await capabilityEngine.execute(workflow.analysis);
      workflow.result = result;
    }
  }

  /**
   * Private Sub-stage: Completion stage
   */
  async #finish(workflow) {
    await this.complete(workflow._id);
  }

  /**
   * Update progress percentage and current step message
   */
  async updateProgress(workflowId, progress, currentStep) {
    const workflow = await this.#getWorkflow(workflowId);
    this.#ensureActive(workflow);

    const clampedProgress = Math.min(100, Math.max(0, progress));
    workflow.progress = clampedProgress;

    if (currentStep) {
      workflow.currentStep = currentStep;
    }

    return this.#save(workflow);
  }

  /**
   * Update overall workflow status
   */
  async updateStatus(workflowId, status) {
    const workflow = await this.#getWorkflow(workflowId);

    if (!Object.values(WORKFLOW_STATUS).includes(status)) {
      throw new AppError(`Invalid workflow status: ${status}`, 400);
    }

    workflow.status = status;

    if (
      status === WORKFLOW_STATUS.COMPLETED ||
      status === WORKFLOW_STATUS.FAILED ||
      status === WORKFLOW_STATUS.CANCELLED
    ) {
      workflow.completedAt = new Date();
    }

    return this.#save(workflow);
  }

  /**
   * Mark a specific step as running
   */
  async startStep(workflowId, stepId) {
    const workflow = await this.#getWorkflow(workflowId);
    this.#ensureActive(workflow);

    const step = this.#findStep(workflow, stepId);
    if (!step) {
      throw new AppError(`Step '${stepId}' not found in workflow`, 404);
    }

    step.status = STEP_STATUS.RUNNING;
    step.startedAt = new Date();
    workflow.currentStep = step.name;

    return this.#save(workflow);
  }

  /**
   * Mark a specific step as completed
   */
  async completeStep(workflowId, stepId) {
    const workflow = await this.#getWorkflow(workflowId);
    this.#ensureActive(workflow);

    const step = this.#findStep(workflow, stepId);
    if (!step) {
      throw new AppError(`Step '${stepId}' not found in workflow`, 404);
    }

    step.status = STEP_STATUS.COMPLETED;
    step.completedAt = new Date();

    return this.#save(workflow);
  }

  /**
   * Mark a specific step as failed
   */
  async failStep(workflowId, stepId) {
    const workflow = await this.#getWorkflow(workflowId);
    this.#ensureActive(workflow);

    const step = this.#findStep(workflow, stepId);
    if (!step) {
      throw new AppError(`Step '${stepId}' not found in workflow`, 404);
    }

    step.status = STEP_STATUS.FAILED;
    step.completedAt = new Date();

    return this.#save(workflow);
  }

  /**
   * Append a log entry to the workflow
   */
  async addLog(workflowId, level, message) {
    const workflow = await this.#getWorkflow(workflowId);

    if (!Object.values(LOG_LEVEL).includes(level)) {
      throw new AppError(`Invalid log level: ${level}`, 400);
    }

    workflow.logs.push({
      level,
      message,
      createdAt: new Date(),
    });

    return this.#save(workflow);
  }

  /**
   * Complete the entire workflow
   */
  async complete(workflowId) {
    const workflow = await this.#getWorkflow(workflowId);

    workflow.status = WORKFLOW_STATUS.COMPLETED;
    workflow.progress = 100;
    workflow.currentStep = 'Completed';
    workflow.completedAt = new Date();

    workflow.logs.push({
      level: LOG_LEVEL.INFO,
      message: 'Workflow completed successfully',
      createdAt: new Date(),
    });

    return this.#save(workflow);
  }

  /**
   * Fail the entire workflow
   */
  async fail(workflowId, error) {
    const workflow = await this.#getWorkflow(workflowId);
    const errorMessage = error?.message || error || 'Workflow failed';

    workflow.status = WORKFLOW_STATUS.FAILED;
    workflow.completedAt = new Date();

    workflow.logs.push({
      level: LOG_LEVEL.ERROR,
      message: errorMessage,
      createdAt: new Date(),
    });

    return this.#save(workflow);
  }

  /**
   * Cancel the workflow execution
   */
  async cancel(workflowId) {
    const workflow = await this.#getWorkflow(workflowId);
    this.#ensureActive(workflow);

    workflow.status = WORKFLOW_STATUS.CANCELLED;
    workflow.completedAt = new Date();

    workflow.logs.push({
      level: LOG_LEVEL.WARNING,
      message: 'Workflow cancelled by user',
      createdAt: new Date(),
    });

    return this.#save(workflow);
  }

  /**
   * Pause workflow (Placeholder for V1)
   */
  async pause() {
    throw new AppError('pause() is not implemented in V1', 501);
  }

  /**
   * Resume workflow (Placeholder for V1)
   */
  async resume() {
    throw new AppError('resume() is not implemented in V1', 501);
  }
}

export default new WorkflowEngine();
