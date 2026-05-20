const Admission = require('../models/Admission');
const Student = require('../models/Student');

const getAdmissions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const admissions = await Admission.find(filter).sort({ submittedAt: -1 });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const submitAdmission = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.photo = `/uploads/${req.file.filename}`;
    const admission = await Admission.create(data);
    res.status(201).json({ message: 'Admission submitted successfully', admission });
  } catch (error) {
    res.status(400).json({ message: 'Submission error', error: error.message });
  }
};

const updateAdmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ message: 'Admission not found' });

    if (admission.status === 'approved' && status === 'approved') {
      return res.status(400).json({ message: 'Admission already approved and student created' });
    }

    admission.status = status;
    await admission.save();

    if (status === 'approved') {
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const feesRecord = months.map(month => ({
        month, admissionFees: 0, tuitionFees: 0, fine: 0, paid: false,
      }));

      await Student.create({
        name: admission.applicantName,
        age: admission.age,
        class: admission.applyingForClass,
        courseType: admission.courseType,
        subCourse: admission.subCourse || '',
        guardianName: admission.fatherName || admission.motherName || '',
        phone: admission.phoneNo || '',
        photo: admission.photo || '',
        admissionDate: admission.submittedAt || Date.now(),
        feesRecord,
      });
    }

    res.json({ message: `Admission ${status}`, admission });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAdmissions, submitAdmission, updateAdmissionStatus };