import Startup from '../models/Startup.js';
import User from '../models/User.js';

export const getUserStartups = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const startups = await Startup.find({
      $or: [
        { _id: { $in: user.followingStartups } },
        { members: req.user.id }
      ]
    });

    const startupsWithStatus = startups.map(startup => ({
      ...startup.toObject(),
      isFollowing: user.followingStartups.includes(startup._id),
      isMember: startup.members.includes(req.user.id)
    }));

    res.json(startupsWithStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const followStartup = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.followingStartups.includes(req.params.id)) {
      user.followingStartups.push(req.params.id);
      await user.save();
    }
    res.json({ message: 'Startup followed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const unfollowStartup = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.followingStartups = user.followingStartups.filter(
      id => id.toString() !== req.params.id
    );
    await user.save();
    res.json({ message: 'Startup unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const leaveStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    startup.members = startup.members.filter(
      id => id.toString() !== req.user.id
    );
    await startup.save();
    res.json({ message: 'Left startup successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 