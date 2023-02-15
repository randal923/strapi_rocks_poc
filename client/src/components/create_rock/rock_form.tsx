import { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Typography,
  Container,
  MenuItem,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import styled from "styled-components";
import axios from "axios";
import Cookies from "js-cookie";

interface Props {
  user: any;
  setUser: any;
}

export const RockForm = (props: Props) => {
  const { user } = props;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Not_Started");

  const jwtToken = Cookies.get("jwt");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!jwtToken) return;

    event.preventDefault();

    const body = {
      title,
      description,
      status,
      due_date: dueDate,
      user_id: user.id,
    };

    console.log(body);

    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };

    try {
      const response = await axios.post(
        "http://localhost:3006/graphql",
        {
          query: `
        mutation createRock($data: RockInput!) {
          createRock(data: $data) {
            data {
              attributes {
                title
                status
                description
                due_date
                 user_id {
                  data {
                    attributes {
                      username
                    }
                  }
                }
              }
            }
          }
        }
      `,
          variables: {
            data: body,
          },
        },
        {
          headers,
        }
      );

      console.log("Rock created:", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper>
        <StyledAvatar>
          <AddIcon />
        </StyledAvatar>
        <Typography component="h1" variant="h5">
          Create a Rock
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <StyledInput
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <StyledInput
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <StyledInput
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="due-date"
            label="Due Date"
            name="due-date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
          <StyledSelect
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="status"
            label="Status"
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            select
          >
            <MenuItem value="Not_Started">Not Started</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </StyledSelect>
          <StyledSubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Create
          </StyledSubmitButton>
        </StyledForm>
      </StyledPaper>
    </Container>
  );
};

const StyledPaper = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledAvatar = styled(Avatar)`
  margin: 1px;
  background-color: black;
`;

const StyledForm = styled.form`
  width: 100%;
  margin-top: 1px;
`;

const StyledInput = styled(TextField)`
  & .MuiInputBase-input {
    color: black;
  }
`;

const StyledSubmitButton = styled(Button)`
  margin: 3px 0 2px;
`;

const StyledSelect = styled(TextField)`
  & .MuiInputBase-input {
    color: black;
  }
`;
