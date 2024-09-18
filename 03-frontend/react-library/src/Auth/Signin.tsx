import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import jwtDecode from "jwt-decode";
import InputField from "../InputField/InputField";
import { useMyContext } from "../store/ContextApi";
import toast from "react-hot-toast";

export const Signin = () => {
  const [loading, setLoading] = useState(false);
  const { setToken, token } = useMyContext();
  const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      code: "",
    },
    mode: "onTouched",
  });

  const handleSuccessfulLogin = (token: string, decodedToken: any) => {
    const user = {
      username: decodedToken.sub,
      roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
    };
    localStorage.setItem("JWT_TOKEN", token);
    localStorage.setItem("USER", JSON.stringify(user));

    setToken(token);
    navigate("/home");
  };

  const onLoginHandler = async (data: {
    username: string;
    password: string;
    code: string;
  }) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/public/signin", data);

      toast.success("Login Successful");
      reset();

      if (response.status === 200 && response.data.jwtToken) {
        const decodedToken = jwtDecode(response.data.jwtToken);
        handleSuccessfulLogin(response.data.jwtToken, decodedToken);
      } else {
        toast.error(
          "Login failed. Please check your credentials and try again."
        );
      }
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onLoginHandler)}
        className="sm:w-[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4"
      >
        <div>
          <h1 className="font-montserrat text-center font-bold text-2xl">
            Login Here
          </h1>
          <p className="text-slate-600 text-center">
            Please enter your username and password
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <InputField
            label="UserName"
            required={true}
            id="username"
            type="text"
            message="*Username is required"
            placeholder="Type your username"
            register={register}
            errors={errors}
            className="" // Provide default or empty value if not needed
            min={undefined} // Use undefined if not required
            value={undefined} // Use undefined if not required
            autoFocus={undefined} // Use undefined if not required
            readOnly={undefined} // Use undefined if not required
          />
          <InputField
            label="Password"
            required={true}
            id="password"
            type="password"
            message="*Password is required"
            placeholder="Type your password"
            register={register}
            errors={errors}
            className="" // Provide default or empty value if not needed
            min={undefined} // Use undefined if not required
            value={undefined} // Use undefined if not required
            autoFocus={undefined} // Use undefined if not required
            readOnly={undefined} // Use undefined if not required
          />
        </div>

        <button
          className="bg-customRed font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
          type="submit"
        >
          {loading ? <span>Loading...</span> : "Log In"}
        </button>

        <p className="text-sm text-slate-700">
          <Link className="underline hover:text-black" to="/forgot-password">
            Forgot Password?
          </Link>
        </p>
        <p className="text-center text-sm text-slate-700 mt-6">
          Don't have an account?{" "}
          <Link
            className="font-semibold underline hover:text-black"
            to="/signup"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};
