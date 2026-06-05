const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { search, status, priority, sort, page = 1, limit = 10 } = req.query;
    const filter = { userId: req.user._id };

    if (status && ['pending', 'completed'].includes(status)) {
      filter.status = status;
    }
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { position: 1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 };
    else if (sort === '-dueDate') sortOption = { dueDate: -1 };
    else if (sort === 'priority') sortOption = { priority: 1 };
    else if (sort === '-priority') sortOption = { priority: -1 };
    else if (sort === 'createdAt') sortOption = { createdAt: 1 };
    else if (sort === '-createdAt') sortOption = { createdAt: -1 };
    else if (sort === 'title') sortOption = { title: 1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Task.countDocuments(filter),
    ]);

    res.json({
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const [total, completed, pending, overdue] = await Promise.all([
      Task.countDocuments({ userId: req.user._id }),
      Task.countDocuments({ userId: req.user._id, status: 'completed' }),
      Task.countDocuments({ userId: req.user._id, status: 'pending' }),
      Task.countDocuments({ userId: req.user._id, status: 'pending', dueDate: { $lt: new Date() } }),
    ]);
    res.json({ total, completed, pending, overdue });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/reorder', async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds array is required' });
    }
    const ops = orderedIds.map((id, idx) => ({
      updateOne: {
        filter: { _id: id, userId: req.user._id },
        update: { $set: { position: idx } },
      },
    }));
    await Task.bulkWrite(ops);
    res.json({ message: 'Reordered' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description').optional().trim().isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const task = await Task.create({
        title: req.body.title,
        description: req.body.description || '',
        priority: req.body.priority || 'medium',
        dueDate: req.body.dueDate || null,
        userId: req.user._id,
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.body.title !== undefined) {
      if (!req.body.title.trim()) {
        return res.status(400).json({ message: 'Title is required' });
      }
      task.title = req.body.title;
    }
    if (req.body.description !== undefined) {
      task.description = req.body.description;
    }
    if (req.body.status !== undefined) {
      if (!['pending', 'completed'].includes(req.body.status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      task.status = req.body.status;
    }
    if (req.body.priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(req.body.priority)) {
        return res.status(400).json({ message: 'Invalid priority' });
      }
      task.priority = req.body.priority;
    }
    if (req.body.dueDate !== undefined) {
      task.dueDate = req.body.dueDate || null;
    }

    const updated = await task.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.status = task.status === 'pending' ? 'completed' : 'pending';
    const updated = await task.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
