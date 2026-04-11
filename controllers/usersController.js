const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const deleteCurrentUser = async (req, res, next) => {
  try {
    const db = getDB();
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await db.collection('users').deleteOne({
      _id: new ObjectId(userId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.logout((error) => {
      if (error) {
        return next(error);
      }

      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        return res.status(200).json({
          message: 'User account deleted successfully'
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting user account',
      error: error.message
    });
  }
};

module.exports = {
  deleteCurrentUser
};
