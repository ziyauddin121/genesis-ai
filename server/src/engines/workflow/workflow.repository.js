import Workflow from './workflow.model.js';

class WorkflowRepository {
  /**
   * Create a new workflow
   */
  async create(data) {
    return Workflow.create(data);
  }

  /**
   * Find workflow by its ID
   */
  async findById(id) {
    return Workflow.findById(id).exec();
  }

  /**
   * Find workflow by Task ID
   */
  async findByTaskId(taskId) {
    return Workflow.findOne({ task: taskId }).exec();
  }

  /**
   * Update workflow by its ID
   */
  async updateById(id, data) {
    return Workflow.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  /**
   * Delete workflow by its ID
   */
  async deleteById(id) {
    return Workflow.findByIdAndDelete(id).exec();
  }
}

export default new WorkflowRepository();
