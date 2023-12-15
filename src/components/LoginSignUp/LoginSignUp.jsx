import React, { useEffect, useState } from "react";
import './LoginSignUp.css'
import {
Form,
FormGroup,
Label,
Input,
Row,
Button,
Table
} from 'reactstrap';
import axios from "axios";

// Carrega e manipula a página de login, criação de conta e ações relacionadas aos usuários
const LoginSignUp = () => {

    // Declaração de vários estados para armazenar informações do usuário e gerenciar o estado do componente
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([])
    const [newUsername, setNewUsername] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Carrega as informações do usuário do localStorage quando o componente é montado
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        // Este useEffect é executado quando o componente é montado.
        // Ele verifica se há informações do usuário no localStorage.
        // Se existirem, ele carrega essas informações e define o estado do usuário com base nesses dados.
        // Esse useEffect só é executado uma vez, quando o componente é inicializado ([] como dependência).
        // Ele é utilizado para carregar os dados do usuário que podem estar armazenados no localStorage,
        // permitindo manter o usuário logado mesmo após o recarregamento da página.
    }, []);

    // Chama a função fetchUsers quando o usuário está autenticado
    useEffect(() => {
        if (user && user.token) {
            fetchUsers();
            setError('');
        }
        // Este useEffect é executado sempre que há uma alteração no estado do usuário.
        // Ele verifica se existe um usuário logado e se há um token de autenticação válido.
        // Se houver um usuário logado e um token válido, ele chama a função fetchUsers(),
        // que busca todos os usuários da API.
        // Além disso, ele limpa o estado de erro (caso haja algum erro anteriormente).
        // Esse useEffect é utilizado para acionar uma ação específica (buscar usuários)
        // sempre que o usuário está autenticado ou quando ocorrem alterações no estado do usuário.
    }, [user])

    // Função que lida com a ação de login ou criação de conta
    const handleAction = async (e) => {
        e.preventDefault();

        if (action === 'ENTRAR') {
            // Valida se os campos de login estão preenchidos
            if (username.trim().length === 0 ||
                password.trim().length === 0) {
                setError('Por favor, preencha todos os campos!');
                return;
            }

            try {
                // Tenta fazer uma requisição POST para a rota de autenticação (login)
                const response = await axios.post(
                    'http://localhost:3000/auth',
                    JSON.stringify({ username, password }),
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );

                // Se a autenticação for bem-sucedida, atualiza o estado do usuário e limpa erros
                setUser(response.data);
                setError('');
                localStorage.setItem('user', JSON.stringify(response.data));
                fetchUsers(); // Atualiza a lista de usuários após o login

            } catch (error) {
                if (!error?.response) {
                    setError('Erro ao acessar o servidor');
                } else if (error.response.status == 401) {
                    setError('Usuário ou senha inválidos');
                }
            }

        } else if (action === 'CRIAR CONTA') {
            // Valida se os campos de registro estão preenchidos
            if (name.trim().length === 0 ||
                username.trim().length === 0 ||
                password.trim().length === 0) {
                setError('Por favor, preencha todos os campos!');
                return;
            }

            try {
                // Tenta fazer uma requisição POST para criar um novo usuário
                const response = await axios.post(
                    'http://localhost:3000/user',
                    JSON.stringify({ name, username, password }),
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );

                if (response.status == 200) {
                    try {
                        const response = await axios.post(
                            'http://localhost:3000/auth',
                            JSON.stringify({ username, password }),
                            {
                                headers: { 'Content-Type': 'application/json' }
                            }
                        );

                        // Se o login após a criação do usuário for bem-sucedido, atualiza o estado do usuário
                        setUser(response.data)
                        setError('')
                        localStorage.setItem('user', JSON.stringify(response.data))

                    } catch (error) {
                        if (!error?.response) {
                            setError('Erro ao acessar o servidor');
                        }
                    }
                }
            } catch (error) {
                if (!error?.response) {
                    setError('Erro ao acessar o servidor');
                } else if (error.response.status == 401) {
                    setError('Não foi possível adicionar o usuário')
                } else if (error.response.status == 400) {
                    setError('Usuário já existente, tente outro username')
                }
            }
        }
    };

    // Função que lida com a exclusão da conta do usuário
    const handleDelete = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('Não há usuários logado, PARABÉNS PELA FAÇANHA');
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:3000/user/${user.user.id}`,
                {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                }
            );

            if (response.status === 200) {
                handleLogout(e);
            }

        } catch (error) {
            if (!error?.response) {
                setError('Erro ao acessar o servidor')
            }
        }
    };

    // Função que lida com a edição da conta do usuário
    const handleEditAccount = async (e) => {
        e.preventDefault();

        const userId = JSON.parse(localStorage.getItem('user')).user.id;

        try {
            const response = await axios.put(`http://localhost:3000/user/${userId}`,
                JSON.stringify({ name: user.user.name, username: newUsername, password: user.user.password }),
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` }
                });

            if (response.status === 200) {
                setUsername(newUsername);
                setNewUsername('');
                setError('');
                toggleEdit();
            }
        } catch (error) {
            if (!error?.response) {
                setError('Erro ao acessar o servidor')
            } else if (error.response.status == 400) {
                setError('Usuário já existente')
            }
        }
    }

    // Função que busca todos os usuários
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/user',
                {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
            setUsers(response.data);
        } catch (error) {
            console.log(error)
            if (!error?.response) {
                setError('Erro ao buscar usuários');
            }
        }
    }

    // Função que lida com o logout do usuário
    const handleLogout = async (e) => {
        e.preventDefault();
        setUser(null)
        localStorage.removeItem('user')
        setName('')
        setUsername('')
        setPassword('')
        setError('')
    };

    // Declaração de vários estados para armazenar informações do programa e gerenciar o estado do componente
    const [action, setAction] = useState("CRIAR CONTA");
    const [buttonText, setButtonText] = useState("Já tenho uma conta");
    const [editing, setEditing] = useState(false)

    // Função que alterna entre a edição da conta do usuário
    const toggleEdit = () => {
        setEditing(editing === true ? false : true);
        setError('');
        fetchUsers();
    }

    // Função que alterna entre ações de criação de conta e login
    const toggleButtonText = () => {
        setAction(action === "CRIAR CONTA" ? "ENTRAR" : "CRIAR CONTA");
        setButtonText(buttonText === "Já tenho uma conta" ? "Não tenho uma conta" : "Já tenho uma conta");
    };

    // Retorna a estrutura do componente com base nos estados e funções definidos acima
    return (
        <div>
            {user == null ? (
                <div className="conteudo">
                    <div className='box'>
                        <div className="h2-box">
                            <h2 className='texto-motivacional'>
                                {action}
                            </h2>
                        </div>
                        <Form>
                            <Row>
                                {action === 'ENTRAR' ? <div></div> :
                                    <FormGroup className="inputbox">
                                        <Label for="name">
                                            Nome Completo
                                        </Label>
                                        <Input
                                            className='inputbox'
                                            id="name"
                                            name="name"
                                            placeholder="Ex: João de Oliveira Moraes"
                                            type="text"
                                            required
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </FormGroup>
                                }
                            </Row>
                            <Row>
                                <FormGroup className="inputbox">
                                    <Label for='username'>
                                        Username
                                    </Label>
                                    <Input
                                        id='username'
                                        name='username'
                                        placeholder='Digite o seu Username'
                                        type='text'
                                        required
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup className="inputbox">
                                    <Label for="senha">
                                        Senha
                                    </Label>
                                    <Input
                                        className='inputbox'
                                        id="senha"
                                        name="password"
                                        placeholder="Digite sua Senha"
                                        type="password"
                                        aria-required
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <p className="erro">
                                        {error}
                                    </p>
                                </FormGroup>
                            </Row>
                            <Button
                                className='button-login' onClick={(e) => handleAction(e)}
                            >
                                {action}
                            </Button>
                        </Form>
                        <Button
                            className='aaa' onClick={toggleButtonText}
                        >
                            <span>
                                {buttonText}
                            </span>
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    {editing ? (
                        <div className="conteudo">
                            <div className='box'>
                                <div className="h2-box">
                                    <h2 className='texto-motivacional'>
                                        EDITAR CONTA
                                    </h2>
                                </div>
                                <Form>
                                    <Row>
                                        <FormGroup className="inputbox">
                                            <Label for='username'>
                                                Novo username
                                            </Label>
                                            <Input
                                                id='username'
                                                name='username'
                                                placeholder='Digite o seu Username'
                                                type='text'
                                                required
                                                onChange={(e) => setNewUsername(e.target.value)}
                                            />
                                        </FormGroup>
                                        <p className="erro">
                                            {error}
                                        </p>
                                    </Row>
                                    <Button
                                        className='button-login' onClick={(e) => handleEditAccount(e)}
                                    >
                                        Aplicar Mudanças
                                    </Button>
                                </Form>
                                <Button
                                    className='aaa' onClick={toggleEdit}
                                >
                                    <span>
                                        Cancelar
                                    </span>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="site">
                                <h2>
                                    Bem Vindo!
                                </h2>
                                <p className="erro">
                                    {error}
                                </p>
                                <div className="items">
                                    <Button
                                        className='del-conta'
                                        onClick={(e) => handleDelete(e)}
                                    >
                                        <span>
                                            Deletar conta!
                                        </span>
                                    </Button>
                                    <Button
                                        className="edit-btn"
                                        onClick={toggleEdit}
                                    >
                                        <span>
                                            Editar conta!
                                        </span>
                                    </Button>
                                    <a
                                        className="a-logout"
                                        onClick={(e) => handleLogout(e)}
                                    >
                                        Logout
                                    </a>
                                </div>
                            </div>
                            <div className="site">
                                <div className='pesquisar'>
                                    <h3>
                                        Todos os usuários
                                    </h3>
                                    <Input
                                        type="text"
                                        placeholder="Pesquisar Username"
                                        onChange={e => setSearchTerm(e.target.value)}
                                    >
                                    </Input>
                                </div>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Username</th>
                                            <th>Nome</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.username}</td>
                                                <td>{user.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default LoginSignUp