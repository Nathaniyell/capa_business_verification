import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, FormHelperText, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import { Formik } from "formik";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Must be a valid email")
    .max(255),
  password: Yup.string()
    .max(255)
    .matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$", {
      message:
        "Password Must Contain Minimum eight characters,at least one upper case,one lower case letter , one digit and  one special character. example:Password12#",
    })
    .required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
};

const InputFieldBox = styled(Box)({
  marginBottom: "2rem",
});
const StyledSubmitButton = styled(Button)({
   backgroundColor: "#007FFF",
   width: "100%",
   color: "#ffffff",
   borderRadius: "10px",
   ":hover": {
    backgroundColor: "#008FFF"
   }
});

const Login = () => {

    const[showPassword, setShowPassword] = useState(false)

    const passwordVisibility = () => {
        setShowPassword((prev) => !prev)
    }

    const navigate = useNavigate()

    const handleSubmit = (values)=> {
      const {email, password} = values;

      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
        if(userCredential.user.emailVerified) {
          console.log(userCredential.user.emailVerified)
          navigate("/")
        } 
        else {
          console.log(userCredential.user.emailVerified)
          alert("Verify email before login")
        }
      }).catch((error) => {
        console.error(error)
      })
    }

  return (
    <Box className="w-full h-screen bg-zinc-100 flex justify-center items-center">
      <div className="w-[95%] md:w-[40%] my-0 mx-auto">
        <Box sx={{ marginBottom: "1rem" }}>
      <Typography variant="h5" align="center" sx={{fontWeight: "bold"}} className="text-green-600" gutterBottom>
          CapaBusiness Verification
        </Typography>
        <Typography variant="body2" align="center" sx={{fontWeight: "bold"}} gutterBottom>
          Log into your account
        </Typography>
      </Box>

      <br />

      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(false);
          handleSubmit(values);
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            
            <InputFieldBox>
              <TextField
                type="email"
                id="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email"
                placeholder="johndoe@gmail.com"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />{touched.email && errors.email && (
                <FormHelperText id="standard-weight-helper-text--register" error>
                  {errors.email}
                </FormHelperText>
              )}
            </InputFieldBox>
            <InputFieldBox>
              <TextField
                type={!showPassword ? "password" : "text"}
                id="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                label="Password"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                        <IconButton>
                        <Lock />
                        </IconButton>
                      
                    </InputAdornment>
                    
                  ),
                  endAdornment: (
                    <InputAdornment position="start">
                        <IconButton onClick={passwordVisibility}>
                            {!showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      
                    </InputAdornment>
                    
                  ),
                }}
              />{touched.password && errors.password && (
                <FormHelperText id="standard-weight-helper-text--register" error>
                  {errors.password}
                </FormHelperText>
              )}
            </InputFieldBox>
            <StyledSubmitButton type="submit" >Login</StyledSubmitButton>

            <Box sx={{marginTop: "10px"}}>
            <Typography variant="body2" gutterBottom>Don't have an account? <Link className="text-blue-500" to="/register">Signup</Link></Typography>
            <Typography variant="body2" gutterBottom>Forgot Password? <Link className="text-blue-500" to="/reset-password">Reset Password</Link></Typography>
            </Box>
            
          </form>
        )}
      </Formik>
      </div>
      
    </Box>
  );
};

export default Login;
