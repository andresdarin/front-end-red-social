import React from 'react'

export const Register = () => {
    return (
        <>
            <header class="content__header content__header--public">
                <h1 class="content__title">Registro</h1>
            </header>

            <div class="content__posts">
                <form className='register-form'>
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input type="text" name='name' />
                    </div>
                    <div className="form-group">
                        <label htmlFor="surname">Apellido</label>
                        <input type="text" name='surname' />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nick">Nick</label>
                        <input type="text" name='nick' />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">eMail</label>
                        <input type="text" name='email' />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="text" name='password' />
                    </div>
                    <input type='submit' value='Registrate' className='btn btn-success'></input>
                </form>

            </div>
        </>
    )
}
