import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BigLogo from "../components/BigLogo";
import { ThreeDots } from "react-loader-spinner";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      navigate("/hoje");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(
        "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/auth/login",
        formData
      )
      .then((response) => {
        setLoading(false);
        const userData = {
          ...response.data,
          token: response.data.token, // Adiciona o token ao objeto userData
        };
        login(userData);
        navigate("/hoje");
      })
      .catch((error) => {
        setLoading(false);
        alert(
          "Erro ao fazer login. Verifique suas credenciais e tente novamente."
        );
        console.error(error);
      });
  };

  return (
    <LoginContainer>
      <BigLogo />
      <LoginForm onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="senha"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <ThreeDots color="#FFFFFF" height={30} width={30} />
          ) : (
            "Entrar"
          )}
        </Button>
        <SignupLink to="/cadastro">Não tem uma conta? Cadastre-se</SignupLink>
      </LoginForm>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  background-color: ${(props) => props.theme.colors.backgroundLogin};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 68px;
  height: 100vh;
  color: ${(props) => props.theme.colors.text};
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 72px);
  gap: 6px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${(props) => props.theme.colors.unfocused};
  border-radius: 5px;
  width: 100%;
  color: ${(props) =>
    props.disabled ? props.theme.colors.disabledText : props.theme.colors.text};
  background-color: ${(props) =>
    props.disabled ? props.theme.colors.disabledBox : "transparent"};

  &::placeholder {
    color: ${(props) =>
      props.disabled
        ? props.theme.colors.disabledText
        : props.theme.colors.unfocused};
  }
  font-size: 20px;
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  background-color: ${(props) => props.theme.colors.secondary};
  color: rgba(255, 255, 255, 1);
  border-radius: 5px;
  cursor: pointer;
  width: 107%;
  font-size: 20px;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SignupLink = styled(Link)`
  margin-top: 25px;
  font-size: 14px;
  color: ${(props) => props.theme.colors.secondary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default Login;
