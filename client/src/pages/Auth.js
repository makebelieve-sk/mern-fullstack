import React, {useState, useEffect, useContext} from 'react';
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/auth.context";

export default function AuthPage() {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const { loading, request, error, clearError } = useHttp();

    const [ form, setForm ] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError])

    const changeHandler = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message);
        } catch (e) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId);
        } catch (e) {}
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>AuthPage</h1>

                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                            <div className="input-field">
                                <input
                                    placeholder="Введите почту"
                                    id="email"
                                    type="email"
                                    name="email"
                                    onChange={changeHandler}
                                    value={form.email}
                                    className="yellow-input" />
                                <label htmlFor="email">Почта</label>
                            </div>
                            <div className="input-field">
                                <input
                                    placeholder="Введите пароль"
                                    id="password"
                                    type="password"
                                    name="password"
                                    onChange={changeHandler}
                                    value={form.password}
                                    className="yellow-input" />
                                <label htmlFor="password">Пароль</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn yellow darken-4"
                            disabled={loading}
                            style={{marginRight: 10}}
                            onClick={loginHandler}
                        >
                            Войти
                        </button>
                        <button
                            onClick={registerHandler}
                            disabled={loading}
                            className="btn grey lighten-1"
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}