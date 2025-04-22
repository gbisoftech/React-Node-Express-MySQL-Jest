//importing libraries, functional components and Material-UI components
import { useState, useEffect, useRef } from "react";
import api from "../../utils/api";
import { Toaster, toast } from "sonner";
import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Container,
  Button,
  Modal,
  TextField
} from "@mui/material";

//creation of the parent functional component which will be pased to app.jsx
function Table() {
  //using use state, use ref for state variables and ref to track if fetch has already been attempted
  const [articles, setArticles] = useState([]);
  const [currentArticle, setCurrentArticle] = useState({ id: 0, title: "", content: "" });
  const [action, setAction] = useState("");
  const [open, setOpen] = useState(false);
  const hasFetchedArticles = useRef(false);

  //async await useEffect function for fetching data from server
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/articles");
        //setting the empty array as a json object of articles got from the server
        setArticles(response.data);

        //using the articleef current which is the same as initialized untill changes
        if (!hasFetchedArticles.current) {
          toast.success("Data Fetched");
          hasFetchedArticles.current = true; // set the ref to true after first fetch
        }
      } catch (error) {
        console.log("There was an error fetching the articles!", error);

        //if we haven't fetched it stay as it is
        if (!hasFetchedArticles.current) {
          toast.error("Error Fetching Data");
          hasFetchedArticles.current = true; // set the ref to true after first fetch attempt
        }
      }
    };

    //calling the function here
    fetchArticles();
  }, []);

  const handleCurrentArticle = () => {
    setOpen(false);
    if (action == "create") {
      api.post("/articles", currentArticle)
        .then((response) => {
          console.log('create success', response.data);
          setArticles((prevarticles) => [...prevarticles, response.data]);
        })
        .catch((error) => {
          console.log("There was an error creating the article!", error);
        });
    } else if (action == "edit") {
      api.put(`/articles/${currentArticle.id}`, currentArticle)
        .then((response) => {
          setArticles((prevArticles) => prevArticles.map((article) => article.id === currentArticle.id ? response.data : article));
        })
        .catch((error) => {
          console.log("There was an error updating the article!", error);
        });
    }
  };

  const handleDelete = (id) => {
    api.request({
      method: "delete",
      url: `/articles/${id}`,
      data: { id }
    }).then((response) => {
      toast.success("article Deleted");
      setArticles((prevArticles) => prevArticles.filter((article) => article.id !== id));
    }).catch((error) => {
      console.log("There was an error deleting the article!", error);
    });

  }

  return (
    <Box position={"relative"}>
      <Toaster richColors closeButton />
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Article Table
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
          <Button variant="contained" color="success" onClick={() => { setOpen(true); setAction("create"); setCurrentArticle({ id: 0, title: "", content: "" }) }}>Create article</Button>
        </Box>

        {articles.length === 0 ? (
          <Typography variant="h5" align="center">
            No articles in Database
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <MUITable sx={{ minWidth: 40 }}>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {articles.map((article, index) => (
                  <TableRow key={article.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{article.title}</TableCell>
                    <TableCell>{article.content}</TableCell>
                    <TableCell sx={{ display: "flex", gap: 2 }}>
                      <Button variant="contained" color="primary" onClick={() => { setOpen(true); setAction("edit"); setCurrentArticle(article) }}>Edit</Button>
                      <Button variant="contained" color="secondary" onClick={() => { handleDelete(article.id) }}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </MUITable>
          </TableContainer>
        )}
      </Container>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={{
          bgcolor: "white",
          width: "50%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 2,
        }}>
          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            value={currentArticle.title}
            onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
          />
          <TextField
            id="outlined-basic"
            label="Content"
            variant="outlined"
            value={currentArticle.content}
            onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
          />

          <Button variant="contained" color="success" onClick={handleCurrentArticle}>Save</Button>
        </Box>
      </Modal>
    </Box>
  );
}

//exporting the component to be using it in the app.jsx
export default Table;
