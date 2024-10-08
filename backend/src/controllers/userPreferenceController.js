const { UserPreference } = require('../models');

const getUserPreferences = async (req, res) => {
  try {
    const preferences = await UserPreference.findOne({ where: { userId: req.user.id } });
    if (!preferences) {
      return res.status(404).json({ message: 'User preferences not found' });
    }
    res.json(preferences);
  } catch (error) {
    console.error('Error in getUserPreferences:', error);
    res.status(500).json({ message: 'Failed to fetch user preferences', error: error.message });
  }
};

const updateUserPreferences = async (req, res) => {
  try {
    console.log('Received request to update preferences:', req.body);
    const { riskTolerance, investmentGoals, investmentHorizon } = req.body;
    const userId = req.user.id;

    console.log('User ID:', userId);

    let [userPreference, created] = await UserPreference.findOrCreate({
      where: { userId },
      defaults: { riskTolerance, investmentGoals, investmentHorizon }
    });

    if (!created) {
      console.log('Updating existing preferences');
      userPreference = await userPreference.update({ riskTolerance, investmentGoals, investmentHorizon });
    } else {
      console.log('Created new preferences');
    }

    console.log('Updated preferences:', userPreference);
    res.json(userPreference);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ message: 'Failed to update preferences', error: error.message });
  }
};

module.exports = { getUserPreferences, updateUserPreferences };