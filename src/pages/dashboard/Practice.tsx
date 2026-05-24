import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Chip,
  Checkbox,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import {
  createLesson,
  getLessons,
  updateLesson,
} from "../../services/lessonService";

import { getSubjects } from "../../services/subjectService";
import ReactQuill from "react-quill-new";
import "quill/dist/quill.snow.css";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} from "../../services/questionService";

import {
  createPaper,
  getPapers,
  deletePaper,
  updatePaperStatus,
  updatePaper,
  getPaperById,
} from "../../services/paperService";

const classes = [
  "Nursery",
  "LKG",
  "UKG",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
];

const initialForm = {
  id: null,
  subject_id: "",
  class_name: "Nursery",
  lesson_name: "",
  description: "",
  status: true,
};

export default function Practice() {
  const [openLesson, setOpenLesson] = useState(false);

  const [subjects, setSubjects] = useState<any[]>([]);

  const [lessons, setLessons] = useState<any[]>([]);

  const [form, setForm] = useState(initialForm);

  const [isEdit, setIsEdit] = useState(false);

  const [openQuestion, setOpenQuestion] = useState(false);

  const [openPaper, setOpenPaper] = useState(false);

  const [questionForm, setQuestionForm] = useState({
    id: null,
    class_name: "",
    subject_id: "",
    lesson_id: "",
    question_type: "MCQ",

    question: "",

    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",

    correct_answer: "",

    explanation: "",
  });

  const [questions, setQuestions] = useState<any[]>([]);

  const [isQuestionEdit, setIsQuestionEdit] = useState(false);
  const filteredLessons = lessons.filter(
    (lesson) => String(lesson.subject_id) === String(questionForm.subject_id),
  );

  const [questionFilters, setQuestionFilters] = useState({
    class_name: "",
    subject_id: "",
    lesson_id: "",
  });

  const [paperForm, setPaperForm] = useState({
    title: "",
    class_name: "",
    is_time_based: false,
    total_duration: "",
    total_qualified_marks: "",
    instructions: "",
    status: true,
  });

  const [paperSubjects, setPaperSubjects] = useState([
    {
      subject_id: "",
      duration_minutes: "",
      positive_marks: "",
      negative_marks: "",
      total_marks: "",
      qualified_marks: "",

      selectedLessons: [],
      selectedQuestions: [],
    },
  ]);

  const [papers, setPapers] = useState<any[]>([]);
  const [isPaperEdit, setIsPaperEdit] = useState(false);

  const [openPaperPreview, setOpenPaperPreview] = useState(false);

  const [selectedPaper, setSelectedPaper] = useState<any>(null);

  const filteredLessonsForGrid = lessons.filter(
    (lesson) =>
      lesson.class_name === questionFilters.class_name &&
      String(lesson.subject_id) === String(questionFilters.subject_id),
  );

  const handleViewPaper = async (paper: any) => {
    try {
      const res = await getPaperById(paper.id);

      setSelectedPaper(res.data);

      setOpenPaperPreview(true);
    } catch (err) {
      console.error(err);
    }
  };

  const loadQuestions = async () => {
    try {
      const res = await getQuestions();

      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSubjects();

    loadLessons();

    loadQuestions();

    loadPapers();
  }, []);

  const handleSaveQuestion = async () => {
    try {
      if (isQuestionEdit) {
        await updateQuestion(questionForm.id as any, questionForm);

        alert("Question updated successfully ✅");
      } else {
        await createQuestion(questionForm);

        alert("Question created successfully ✅");
      }

      setQuestionForm({
        class_name: "",
        subject_id: "",
        lesson_id: "",
        question_type: "MCQ",
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "",
        explanation: "",
      });

      setIsQuestionEdit(false);

      setOpenQuestion(false);

      loadQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditQuestion = (question: any) => {
    setQuestionForm(question);

    setIsQuestionEdit(true);

    setOpenQuestion(true);
  };

  const handleDeleteQuestion = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?",
    );

    if (!confirmDelete) return;

    try {
      await deleteQuestion(id);

      alert("Question deleted successfully");

      loadQuestions();
    } catch (err) {
      console.error(err);
    }
  };
  const loadSubjects = async () => {
    try {
      const res = await getSubjects();

      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadLessons = async () => {
    try {
      const res = await getLessons();

      setLessons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPapers = async () => {
    try {
      const res = await getPapers();

      setPapers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePaper = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this paper?",
    );

    if (!confirmDelete) return;

    try {
      await deletePaper(id);

      alert("Paper deleted successfully");

      loadPapers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePaperStatus = async (paper: any) => {
    try {
      await updatePaperStatus(paper.id, {
        status: !paper.status,
      });

      loadPapers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPaper = (paper: any) => {
    setIsPaperEdit(true);

    setPaperForm({
      id: paper.id,
      title: paper.title,
      class_name: paper.class_name,
      is_time_based: Boolean(paper.is_time_based),
      total_duration: paper.total_duration,
      total_qualified_marks: paper.total_qualified_marks,
      instructions: paper.instructions,
      status: Boolean(paper.status),
    });

    setPaperSubjects(
      paper.subjects?.map((subject: any) => ({
        id: subject.id,
        subject_id: subject.subject_id,
        duration_minutes: subject.duration_minutes,
        positive_marks: subject.positive_marks,
        negative_marks: subject.negative_marks,
        total_marks: subject.total_marks,
        qualified_marks: subject.qualified_marks,

        selectedLessons:
          subject.questions?.map((q: any) => String(q.lesson_id)) || [],

        selectedQuestions:
          subject.questions?.map((q: any) => String(q.question_id)) || [],
      })) || [],
    );

    setOpenPaper(true);
  };
  const handleSavePaper = async () => {
    try {
      const payload = {
        ...paperForm,
        subjects: paperSubjects,
      };

      if (isPaperEdit) {
        await updatePaper(paperForm.id as any, payload);

        alert("Paper updated successfully ✅");
      } else {
        await createPaper(payload);

        alert("Paper created successfully ✅");
      }

      setOpenPaper(false);

      setIsPaperEdit(false);

      loadPapers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSubjects();

    loadLessons();
  }, []);

  const handleSubmitLesson = async () => {
    try {
      if (isEdit) {
        await updateLesson(form.id as any, form);
      } else {
        await createLesson(form);
      }

      alert(
        isEdit
          ? "Lesson updated successfully ✅"
          : "Lesson created successfully ✅",
      );

      setOpenLesson(false);

      setForm(initialForm);

      setIsEdit(false);

      loadLessons();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditLesson = (lesson: any) => {
    setForm(lesson);

    setIsEdit(true);

    setOpenLesson(true);
  };

  const tableHeadStyle = {
    textAlign: "left" as const,
    padding: "12px",
    fontSize: 14,
    fontWeight: 600,
    borderBottom: "1px solid #cbd5e1",
  };

  const tableCellStyle = {
    padding: "12px",
    verticalAlign: "top" as const,
  };

  const filteredQuestionGrid = questions.filter(
    (q) =>
      q.class_name === questionFilters.class_name &&
      String(q.subject_id) === String(questionFilters.subject_id) &&
      String(q.lesson_id) === String(questionFilters.lesson_id),
  );

  return (
    <Box>
      {/* TOP ACTIONS */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            setForm(initialForm);

            setIsEdit(false);

            setOpenLesson(true);
          }}
        >
          Create Lesson
        </Button>

        <Button variant="outlined" onClick={() => setOpenQuestion(true)}>
          Create Question
        </Button>

        <Button variant="outlined" onClick={() => setOpenPaper(true)}>
          Create Paper
        </Button>
      </Paper>

      {/* LESSONS GRID */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h6"
          mb={3}
          style={{ textAlign: "left", marginBottom: "10px" }}
        >
          Lessons
        </Typography>

        {lessons.length === 0 && <Typography>No lessons found</Typography>}

        {lessons.map((lesson) => (
          <Box
            sx={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                  }}
                >
                  <th style={tableHeadStyle}>Lesson</th>
                  <th style={tableHeadStyle}>Subject</th>
                  <th style={tableHeadStyle}>Class</th>
                  <th style={tableHeadStyle}>Description</th>
                  <th style={tableHeadStyle}>Status</th>
                  <th style={tableHeadStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {lessons.map((lesson) => (
                  <tr
                    key={lesson.id}
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <td style={tableCellStyle}>
                      <Typography fontWeight={600}>
                        {lesson.lesson_name}
                      </Typography>
                    </td>

                    <td style={tableCellStyle}>{lesson.subject_name}</td>

                    <td style={tableCellStyle}>{lesson.class_name}</td>

                    <td style={tableCellStyle}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: lesson.description || "-",
                        }}
                      />
                    </td>

                    <td style={tableCellStyle}>
                      <Chip
                        label={lesson.status ? "Active" : "Inactive"}
                        color={lesson.status ? "success" : "error"}
                        size="small"
                      />
                    </td>

                    <td style={tableCellStyle}>
                      <IconButton onClick={() => handleEditLesson(lesson)}>
                        <EditIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        ))}
      </Paper>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          mt: 3,
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          mb={2}
          style={{ textAlign: "left", marginBottom: "10px" }}
        >
          Question Filters
        </Typography>

        <Grid container spacing={2}>
          {/* CLASS */}
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Class"
              value={questionFilters.class_name}
              onChange={(e) =>
                setQuestionFilters({
                  ...questionFilters,
                  class_name: e.target.value,
                  subject_id: "",
                  lesson_id: "",
                })
              }
              style={{
                width: "200px",
                textAlign: "left",
              }}
            >
              {classes.map((cls) => (
                <MenuItem key={cls} value={cls}>
                  {cls}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* SUBJECT */}
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Subject"
              value={questionFilters.subject_id}
              onChange={(e) =>
                setQuestionFilters({
                  ...questionFilters,
                  subject_id: e.target.value,
                  lesson_id: "",
                })
              }
              style={{
                width: "200px",
                textAlign: "left",
              }}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* LESSON */}
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Lesson"
              value={questionFilters.lesson_id}
              onChange={(e) =>
                setQuestionFilters({
                  ...questionFilters,
                  lesson_id: e.target.value,
                })
              }
              style={{
                width: "200px",
                textAlign: "left",
              }}
            >
              {filteredLessonsForGrid.map((lesson) => (
                <MenuItem key={lesson.id} value={lesson.id}>
                  {lesson.lesson_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          mt: 3,
        }}
      >
        <Typography
          variant="h6"
          mb={3}
          style={{ textAlign: "left", marginBottom: "10px" }}
        >
          Questions
        </Typography>

        {!questionFilters.lesson_id ? (
          <Typography
            color="text.secondary"
            style={{ textAlign: "left", marginBottom: "10px" }}
          >
            Please select Class, Subject and Lesson
          </Typography>
        ) : filteredQuestionGrid.length === 0 ? (
          <Typography style={{ textAlign: "left", marginBottom: "10px" }}>
            No questions found
          </Typography>
        ) : null}

        {/* HEADER */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1fr 120px 140px",
            gap: 2,
            px: 2,
            py: 1.5,
            background: "#f8fafc",
            borderRadius: 2,
            fontWeight: 700,
            mb: 1,
            textAlign: "left",
          }}
        >
          <Typography fontWeight={700}>Question</Typography>

          <Typography fontWeight={700}>Lesson</Typography>

          <Typography fontWeight={700}>Subject</Typography>

          <Typography fontWeight={700}>Class</Typography>

          <Typography fontWeight={700}>Actions</Typography>
        </Box>

        {/* ROWS */}
        {filteredQuestionGrid.map((q) => (
          <Box
            key={q.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "1.8fr 1fr 1fr 120px 140px",
              gap: 2,
              px: 2,
              py: 2,
              borderBottom: "1px solid #eee",
              alignItems: "center",
              textAlign: "left",
              "&:hover": {
                background: "#f8fafc",
              },
            }}
          >
            {/* QUESTION */}
            <Box
              sx={{
                maxHeight: 80,
                overflow: "hidden",
              }}
            >
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{
                  __html: q.question,
                }}
              />
            </Box>

            {/* LESSON */}
            <Typography variant="body2">{q.lesson_name}</Typography>

            {/* SUBJECT */}
            <Typography variant="body2">{q.subject_name}</Typography>

            {/* CLASS */}
            <Typography variant="body2">{q.class_name}</Typography>

            {/* ACTIONS */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <IconButton color="primary" onClick={() => handleEditQuestion(q)}>
                <EditIcon />
              </IconButton>

              <IconButton
                color="error"
                onClick={() => handleDeleteQuestion(q.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Paper>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          mt: 3,
        }}
      >
        <Typography
          variant="h6"
          mb={3}
          style={{ textAlign: "left", marginBottom: "10px" }}
        >
          Practice Papers
        </Typography>

        {papers.length === 0 ? (
          <Typography color="text.secondary" style={{ textAlign: "left" }}>
            No papers found
          </Typography>
        ) : (
          <>
            {/* HEADER */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 120px 150px 150px 150px",
                gap: 2,
                px: 2,
                py: 1.5,
                background: "#f8fafc",
                borderRadius: 2,
                fontWeight: 700,
                mb: 1,
                textAlign: "left",
              }}
            >
              <Typography fontWeight={700}>Paper Title</Typography>

              <Typography fontWeight={700}>Class</Typography>

              <Typography fontWeight={700}>Qualified</Typography>

              <Typography fontWeight={700}>Status</Typography>

              <Typography fontWeight={700}>Actions</Typography>
            </Box>

            {/* ROWS */}
            {papers.map((paper) => (
              <Box
                key={paper.id}
                onClick={() => handleViewPaper(paper)}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 120px 150px 150px 150px",
                  gap: 2,
                  px: 2,
                  py: 2,
                  borderBottom: "1px solid #eee",
                  alignItems: "center",
                  textAlign: "left",
                  "&:hover": {
                    background: "#f8fafc",
                  },
                }}
              >
                {/* TITLE */}
                <Typography fontWeight={600}>{paper.title}</Typography>

                {/* CLASS */}
                <Typography>{paper.class_name}</Typography>

                {/* QUALIFIED */}
                <Typography>{paper.total_qualified_marks}</Typography>

                {/* STATUS */}
                <Chip
                  label={paper.status ? "Active" : "Inactive"}
                  color={paper.status ? "success" : "error"}
                  size="small"
                />

                {/* ACTIONS */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleEditPaper(paper)}
                  >
                    <EditIcon />
                  </IconButton>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(paper.status)}
                        onChange={() => handleTogglePaperStatus(paper)}
                      />
                    }
                  />

                  <IconButton
                    color="error"
                    onClick={() => handleDeletePaper(paper.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </>
        )}
      </Paper>

      <Dialog
        open={openPaperPreview}
        onClose={() => setOpenPaperPreview(false)}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>{selectedPaper?.title}</DialogTitle>

        <DialogContent>
          <Box mb={3}>
            <Typography>
              <b>Class:</b> {selectedPaper?.class_name}
            </Typography>

            <Typography>
              <b>Total Qualified Marks:</b>{" "}
              {selectedPaper?.total_qualified_marks}
            </Typography>
          </Box>

          {selectedPaper?.subjects?.map(
            (subject: any, subjectIndex: number) => (
              <Paper
                key={subject.id}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">{subject.subject_name}</Typography>

                  <Typography>
                    Duration: {subject.duration_minutes} mins
                  </Typography>
                </Box>

                {subject.questions?.map((q: any, questionIndex: number) => (
                  <Box
                    key={q.question_id}
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #e2e8f0",
                      transition: "0.3s",
                      cursor: "pointer",

                      "&:hover": {
                        background: "#f8fafc",
                        boxShadow: 2,
                      },

                      "&:hover .mcq-options": {
                        maxHeight: 1000,
                        opacity: 1,
                        mt: 2,
                      },
                    }}
                  >
                    {/* QUESTION */}
                    <Typography mb={2} fontWeight={700}>
                      Q{questionIndex + 1}.
                    </Typography>

                    <Box
                      dangerouslySetInnerHTML={{
                        __html: q.question,
                      }}
                    />

                    {/* OPTIONS */}
                    {q.question_type === "MCQ" && (
                      <Box
                        className="mcq-options"
                        sx={{
                          maxHeight: 0,
                          overflow: "hidden",
                          opacity: 0,
                          transition: "all 0.4s ease",
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography fontWeight={600}>A</Typography>

                            <Box
                              dangerouslySetInnerHTML={{
                                __html: q.option_a,
                              }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <Typography fontWeight={600}>B</Typography>

                            <Box
                              dangerouslySetInnerHTML={{
                                __html: q.option_b,
                              }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <Typography fontWeight={600}>C</Typography>

                            <Box
                              dangerouslySetInnerHTML={{
                                __html: q.option_c,
                              }}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <Typography fontWeight={600}>D</Typography>

                            <Box
                              dangerouslySetInnerHTML={{
                                __html: q.option_d,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                ))}
              </Paper>
            ),
          )}
        </DialogContent>
      </Dialog>
      {/* CREATE LESSON DIALOG */}
      <Dialog
        open={openLesson}
        onClose={() => setOpenLesson(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{isEdit ? "Update Lesson" : "Create Lesson"}</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Class"
                value={form.class_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    class_name: e.target.value,
                  })
                }
                style={{
                  width: "200px",
                }}
              >
                {classes.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Subject"
                value={form.subject_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subject_id: e.target.value,
                  })
                }
                style={{
                  width: "200px",
                }}
              >
                {subjects.map((s: any) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.subject_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                width: "100%",
              }}
            >
              <TextField
                fullWidth
                label="Lesson Name"
                value={form.lesson_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    lesson_name: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              style={{
                width: "100%",
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.checked,
                      })
                    }
                  />
                }
                label={form.status ? "Active" : "Inactive"}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSubmitLesson}>
                {isEdit ? "Update Lesson" : "Create Lesson"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openQuestion}
        onClose={() => setOpenQuestion(false)}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>Create Question</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {/* CLASS */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Class"
                fullWidth
                value={questionForm.class_name}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    class_name: e.target.value,
                  })
                }
                style={{
                  width: "200px",
                }}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* SUBJECT */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Subject"
                fullWidth
                value={questionForm.subject_id}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    subject_id: e.target.value,
                    lesson_id: "",
                  })
                }
                style={{
                  width: "200px",
                }}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.subject_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* LESSON */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Lesson"
                fullWidth
                value={questionForm.lesson_id}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    lesson_id: e.target.value,
                  })
                }
                style={{
                  width: "200px",
                }}
              >
                {filteredLessons.map((lesson) => (
                  <MenuItem key={lesson.id} value={lesson.id}>
                    {lesson.lesson_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* QUESTION TYPE */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Question Type"
                fullWidth
                value={questionForm.question_type}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    question_type: e.target.value,
                  })
                }
                style={{
                  width: "200px",
                }}
              >
                <MenuItem value="MCQ">MCQ</MenuItem>

                <MenuItem value="DESCRIPTIVE">Descriptive</MenuItem>
              </TextField>
            </Grid>

            {/* QUESTION */}
            <Grid item xs={12} style={{ width: "100%" }}>
              <Typography mb={1}>Question</Typography>
              <ReactQuill
                theme="snow"
                value={questionForm.question}
                onChange={(value) =>
                  setQuestionForm({
                    ...questionForm,
                    question: value,
                  })
                }
                style={{
                  height: 200,
                  marginBottom: 50,
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {/* MCQ OPTIONS */}
            {questionForm.question_type === "MCQ" && (
              <>
                <Grid item xs={12} style={{ width: "100%" }}>
                  <Typography mb={1}>Option A</Typography>

                  <ReactQuill
                    theme="snow"
                    value={questionForm.option_a}
                    onChange={(value) =>
                      setQuestionForm({
                        ...questionForm,
                        option_a: value,
                      })
                    }
                    style={{
                      height: 120,
                      marginBottom: 50,
                      width: "100%",
                    }}
                  />
                </Grid>

                <Grid item xs={12} style={{ width: "100%" }}>
                  <Typography mb={1}>Option B</Typography>

                  <ReactQuill
                    theme="snow"
                    value={questionForm.option_b}
                    onChange={(value) =>
                      setQuestionForm({
                        ...questionForm,
                        option_b: value,
                      })
                    }
                    style={{
                      height: 120,
                      marginBottom: 50,
                    }}
                  />
                </Grid>

                <Grid item xs={12} style={{ width: "100%" }}>
                  <Typography mb={1}>Option C</Typography>

                  <ReactQuill
                    theme="snow"
                    value={questionForm.option_c}
                    onChange={(value) =>
                      setQuestionForm({
                        ...questionForm,
                        option_c: value,
                      })
                    }
                    style={{
                      height: 120,
                      marginBottom: 50,
                    }}
                  />
                </Grid>

                <Grid item xs={12} style={{ width: "100%" }}>
                  <Typography mb={1}>Option D</Typography>

                  <ReactQuill
                    theme="snow"
                    value={questionForm.option_d}
                    onChange={(value) =>
                      setQuestionForm({
                        ...questionForm,
                        option_d: value,
                      })
                    }
                    style={{
                      height: 120,
                      marginBottom: 50,
                    }}
                  />
                </Grid>
                <Grid item xs={12} style={{ width: "100%" }}>
                  <Typography mb={1}>Explanation</Typography>

                  <ReactQuill
                    theme="snow"
                    value={questionForm.explanation}
                    onChange={(value) =>
                      setQuestionForm({
                        ...questionForm,
                        explanation: value,
                      })
                    }
                    style={{
                      height: 200,
                      marginBottom: 50,
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={3}
                  style={{
                    width: "200px",
                  }}
                >
                  <TextField
                    select
                    label="Correct Answer"
                    fullWidth
                    value={questionForm.correct_answer}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        correct_answer: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="D">D</MenuItem>
                  </TextField>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSaveQuestion}>
                {isQuestionEdit ? "Update Question" : "Save Question"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openPaper}
        onClose={() => setOpenPaper(false)}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>
          {isPaperEdit ? "Update Paper" : "Create Paper"}
        </DialogTitle>

        <DialogContent>
          {/* PAPER DETAILS */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              mt: 2,
              mb: 3,
            }}
          >
            <Typography variant="h6" mb={3}>
              Paper Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Paper Title"
                  value={paperForm.title}
                  onChange={(e) =>
                    setPaperForm({
                      ...paperForm,
                      title: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Class"
                  value={paperForm.class_name}
                  onChange={(e) =>
                    setPaperForm({
                      ...paperForm,
                      class_name: e.target.value,
                    })
                  }
                  style={{ width: "200px" }}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>
                      {cls}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={paperForm.is_time_based}
                      onChange={(e) =>
                        setPaperForm({
                          ...paperForm,
                          is_time_based: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Time Based"
                />
              </Grid>

              {paperForm.is_time_based && (
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Total Duration (mins)"
                    value={paperForm.total_duration}
                    onChange={(e) =>
                      setPaperForm({
                        ...paperForm,
                        total_duration: e.target.value,
                      })
                    }
                  />
                </Grid>
              )}

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Qualified Marks"
                  value={paperForm.total_qualified_marks}
                  onChange={(e) =>
                    setPaperForm({
                      ...paperForm,
                      total_qualified_marks: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} style={{ width: "100%" }}>
                <Typography mb={1}>Instructions</Typography>

                <ReactQuill
                  theme="snow"
                  value={paperForm.instructions}
                  onChange={(value) =>
                    setPaperForm({
                      ...paperForm,
                      instructions: value,
                    })
                  }
                  style={{
                    height: 180,
                    marginBottom: 50,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* SUBJECTS */}
          {paperSubjects.map((subjectRow, index) => {
            const filteredLessons = lessons.filter(
              (lesson) =>
                lesson.class_name === paperForm.class_name &&
                String(lesson.subject_id) === String(subjectRow.subject_id),
            );

            const filteredQuestions = questions.filter(
              (q) =>
                q.class_name === paperForm.class_name &&
                String(q.subject_id) === String(subjectRow.subject_id) &&
                subjectRow.selectedLessons.some(
                  (lessonId) => String(lessonId) === String(q.lesson_id),
                ),
            );

            return (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  mb: 3,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Subject {index + 1}</Typography>

                  {paperSubjects.length > 1 && (
                    <Button
                      color="error"
                      onClick={() => {
                        const updated = [...paperSubjects];

                        updated.splice(index, 1);

                        setPaperSubjects(updated);
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>

                <Grid container spacing={2}>
                  {/* SUBJECT */}
                  <Grid item xs={12} md={3}>
                    <TextField
                      select
                      fullWidth
                      label="Subject"
                      value={subjectRow.subject_id}
                      onChange={(e) => {
                        const updated = [...paperSubjects];

                        updated[index].subject_id = e.target.value;

                        updated[index].selectedLessons = [];

                        updated[index].selectedQuestions = [];

                        setPaperSubjects(updated);
                      }}
                      style={{ width: "120px" }}
                    >
                      {subjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                          {subject.subject_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* DURATION */}
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Duration"
                      value={subjectRow.duration_minutes}
                      onChange={(e) => {
                        const updated = [...paperSubjects];

                        updated[index].duration_minutes = e.target.value;

                        setPaperSubjects(updated);
                      }}
                    />
                  </Grid>

                  {/* POSITIVE */}
                  <Grid item xs={12} md={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Positive Marks"
                      value={subjectRow.positive_marks}
                      onChange={(e) => {
                        const updated = [...paperSubjects];

                        updated[index].positive_marks = e.target.value;

                        setPaperSubjects(updated);
                      }}
                    />
                  </Grid>

                  {/* NEGATIVE */}
                  <Grid item xs={12} md={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Negative Marks"
                      value={subjectRow.negative_marks}
                      onChange={(e) => {
                        const updated = [...paperSubjects];

                        updated[index].negative_marks = e.target.value;

                        setPaperSubjects(updated);
                      }}
                    />
                  </Grid>

                  {/* TOTAL */}
                  <Grid item xs={12} md={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Total"
                      value={subjectRow.total_marks}
                      onChange={(e) => {
                        const updated = [...paperSubjects];

                        updated[index].total_marks = e.target.value;

                        setPaperSubjects(updated);
                      }}
                    />
                  </Grid>

                  {/* QUALIFIED */}
                  <Grid item xs={12} md={1}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Qualified"
                      value={subjectRow.qualified_marks}
                      onChange={(e) => {
                        const updated = [...paperSubjects];

                        updated[index].qualified_marks = e.target.value;

                        setPaperSubjects(updated);
                      }}
                    />
                  </Grid>

                  {/* LESSONS */}
                  <Grid item xs={12}>
                    <Typography mb={1}>Select Lessons</Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {filteredLessons.map((lesson) => (
                        <Chip
                          key={lesson.id}
                          label={lesson.lesson_name}
                          clickable
                          color={
                            subjectRow.selectedLessons.includes(lesson.id)
                              ? "primary"
                              : "default"
                          }
                          onClick={() => {
                            const updated = [...paperSubjects];

                            const alreadySelected = updated[
                              index
                            ].selectedLessons.includes(lesson.id);

                            if (alreadySelected) {
                              updated[index].selectedLessons = updated[
                                index
                              ].selectedLessons.filter(
                                (l: number) => l !== lesson.id,
                              );
                            } else {
                              updated[index].selectedLessons.push(
                                String(lesson.id),
                              );
                            }

                            setPaperSubjects(updated);
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  {/* QUESTIONS */}
                  <Grid item xs={12} style={{ width: "100%" }}>
                    <Typography mb={2}>Select Questions</Typography>

                    <Box
                      sx={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      {/* HEADER */}
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "80px 1.8fr 1fr 120px",
                          gap: 2,
                          p: 2,
                          background: "#f8fafc",
                          fontWeight: 700,
                        }}
                      >
                        <Typography>Select</Typography>

                        <Typography>Question</Typography>

                        <Typography>Lesson</Typography>

                        <Typography>Type</Typography>
                      </Box>

                      {/* ROWS */}
                      {filteredQuestions.map((q) => (
                        <Box
                          key={q.id}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "80px 1.8fr 1fr 120px",
                            gap: 2,
                            p: 2,
                            borderTop: "1px solid #eee",
                            alignItems: "center",
                          }}
                        >
                          <Checkbox
                            checked={subjectRow.selectedQuestions.some(
                              (id) => String(id) === String(q.id),
                            )}
                            onChange={(e) => {
                              const updated = [...paperSubjects];

                              if (e.target.checked) {
                                updated[index].selectedQuestions.push(
                                  String(q.id),
                                );
                              } else {
                                updated[index].selectedQuestions = updated[
                                  index
                                ].selectedQuestions.filter(
                                  (id: string) => String(id) !== String(q.id),
                                );
                              }

                              setPaperSubjects(updated);
                            }}
                          />

                          <Box
                            dangerouslySetInnerHTML={{
                              __html: q.question,
                            }}
                          />

                          <Typography>{q.lesson_name}</Typography>

                          <Chip size="small" label={q.question_type} />
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}

          {/* ADD SUBJECT */}
          {paperSubjects.length < 10 && (
            <Button
              variant="outlined"
              sx={{ mb: 3 }}
              onClick={() => {
                setPaperSubjects([
                  ...paperSubjects,
                  {
                    subject_id: "",
                    duration_minutes: "",
                    positive_marks: "",
                    negative_marks: "",
                    total_marks: "",
                    qualified_marks: "",
                    selectedLessons: [],
                    selectedQuestions: [],
                  },
                ]);
              }}
            >
              Add Subject
            </Button>
          )}

          {/* SAVE */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              pb: 2,
            }}
          >
            <Button variant="outlined" onClick={() => setOpenPaper(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSavePaper}>
              {isPaperEdit ? "Update Paper" : "Save Paper"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
