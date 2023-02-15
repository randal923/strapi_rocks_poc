import { useState } from "react";
import { Avatar, Button, TextField, Typography } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import axios from "axios";
import styled from "styled-components";
import Cookies from "js-cookie";

interface Props {
  user: any;
  setUser: any;
}
const LoginForm = (props: Props) => {
  const { user, setUser } = props;

  const [email, setEmail] = useState("randal.andrade@hotmail.com");
  const [password, setPassword] = useState("Qwe123456");
  const [key, setKey] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const mutation = `
        mutation {
            login(input: {identifier: "${email}", password: "${password}"}) {
                jwt
                user {
                id
                username
                }
            }
        }
    `;

    try {
      const response = await axios.post("http://localhost:3006/graphql", {
        query: mutation,
      });
      const data = response.data.data;

      console.log(data);
      setKey(data.login.jwt);
      setUser(data.login.user);

      Cookies.set("jwt", data.login.jwt, { expires: 1 });
    } catch (error: any) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <Container>
      <StyledPaper>
        <StyledAvatar>
          <LockOutlinedIcon />
        </StyledAvatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <StyledInput
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <StyledInput
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <StyledSubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign In
          </StyledSubmitButton>
        </StyledForm>
      </StyledPaper>

      <StyledPaper>
        {user && (
          <>
            <Typography>ID: {user.id}</Typography>
            <Typography>Username: {user.username}</Typography>
          </>
        )}
        <Typography style={{ wordBreak: "break-word" }}>
          JWT Key: {key}
        </Typography>
      </StyledPaper>
    </Container>
  );
};

export default LoginForm;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledPaper = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
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
