1. Visão geral
O back-end desenvolvido consiste em uma API REST para gerenciamento e reserva de recursos de uma instituição de ensino, como salas, laboratórios, auditórios e equipamentos.
A aplicação foi construída utilizando Java, Spring Boot, Maven, Spring Data JPA, PostgreSQL, Spring Security, Basic Auth e JWT. A organização do projeto segue uma arquitetura em camadas, separando responsabilidades entre controllers, services, repositories, entidades, DTOs, configurações de segurança e tratamento de exceções.
Os principais recursos implementados foram:
gerenciamento de recursos;
cadastro de usuários;
autenticação e autorização;
gerenciamento de reservas;
validação de conflitos de horários;
aprovação, rejeição e cancelamento de reservas;
controle de acesso por perfil.

2. Estrutura do projeto
O projeto foi dividido nos seguintes pacotes:
controller
Responsável por receber as requisições HTTP, extrair os dados enviados pelo cliente e devolver as respostas com os códigos HTTP adequados.
Foram criados controllers para:
recursos;
usuários;
autenticação;
reservas.
service
Concentra as regras de negócio da aplicação.
Nessa camada foram implementadas regras como:
criptografia de senha;
normalização de e-mail;
validação de capacidade;
verificação de disponibilidade do recurso;
detecção de conflitos de horários;
controle das transições de status das reservas;
validação de propriedade da reserva;
vinculação da reserva ao usuário autenticado.
repository
Responsável pela comunicação com o PostgreSQL por meio do Spring Data JPA.
Os repositories estendem JpaRepository, permitindo a utilização de métodos como:
save;
findById;
findAll;
delete;
existsById.
Também foram implementadas consultas específicas para:
localizar usuário pelo e-mail;
verificar e-mail duplicado;
listar reservas de um usuário;
listar todas as reservas;
identificar conflitos de horário.
model
Contém as entidades que representam as tabelas do banco de dados.
Foram criadas as entidades:
Usuario;
Recurso;
Reserva.
Também foram criados enums para representar valores restritos:
PerfilUsuario;
TipoRecurso;
StatusRecurso;
StatusReserva.
dto
Os DTOs foram utilizados para separar os dados recebidos e devolvidos pela API das entidades persistidas no banco.
Foram criados DTOs para:
criação e atualização de recursos;
resposta de recursos;
cadastro de usuários;
resposta de usuários;
criação de reservas;
resposta de reservas;
resposta do token JWT.
security
Contém as configurações de autenticação e autorização.
Foram implementados:
carregamento de usuários pelo banco;
autenticação com Basic Auth;
emissão de JWT;
validação de Bearer Token;
autorização por perfil;
respostas padronizadas para erros 401 e 403.
exception
Centraliza as exceções personalizadas e o tratamento global dos erros.
A API utiliza ProblemDetail para retornar respostas de erro padronizadas.

3. Configuração do banco de dados
A aplicação foi conectada a um banco PostgreSQL chamado:
campus_reserve
A configuração foi realizada no arquivo application.properties, contendo:
URL JDBC;
usuário;
senha;
configuração do Hibernate;
exibição das consultas SQL;
desativação do Open Session in View.
Durante o desenvolvimento, foi utilizada a configuração:
spring.jpa.hibernate.ddl-auto=update
Essa opção permitiu que o Hibernate criasse e atualizasse as tabelas automaticamente a partir das entidades JPA.
As principais tabelas criadas foram:
usuarios
recursos
reservas
A tabela reservas possui chaves estrangeiras para:
usuarios
recursos

4. Módulo de recursos
O módulo de recursos foi o primeiro fluxo completo implementado.
A entidade Recurso possui os campos:
id
nome
descricao
tipo
capacidade
localizacao
status
Os tipos permitidos são:
SALA
LABORATORIO
AUDITORIO
EQUIPAMENTO
Os status permitidos são:
DISPONIVEL
INDISPONIVEL
EM_MANUTENCAO
Foi implementado o CRUD completo:
POST   /api/recursos
GET    /api/recursos
GET    /api/recursos/{id}
PUT    /api/recursos/{id}
DELETE /api/recursos/{id}
Regras de segurança
Todos os usuários autenticados podem consultar recursos.
Somente usuários com perfil ADMIN podem:
cadastrar recursos;
atualizar recursos;
excluir recursos.

5. Validação dos recursos
Os dados recebidos são validados com Bean Validation.
Foram utilizadas anotações como:
@NotBlank
@NotNull
@Positive
@Size
@Email
@Future
Exemplos de validações:
nome obrigatório;
localização obrigatória;
tipo obrigatório;
status obrigatório;
capacidade maior que zero;
e-mail válido;
senha com tamanho mínimo;
datas de reserva no futuro.
Quando os dados são inválidos, a API retorna:
400 Bad Request
Exemplo:
{
  "title": "Erro de validação",
  "status": 400,
  "detail": "Um ou mais campos enviados são inválidos.",
  "erros": {
    "nome": "O nome é obrigatório",
    "capacidade": "A capacidade deve ser maior que zero"
  }
}
Também foi implementado tratamento para JSON malformado ou valores incompatíveis com enums.

6. Módulo de usuários
A entidade Usuario possui:
id
nome
email
senha
perfil
ativo
Os perfis disponíveis são:
ADMIN
PROFESSOR
ALUNO
O endpoint público de cadastro é:
POST /api/usuarios
Todo novo usuário cadastrado publicamente recebe automaticamente:
perfil = ALUNO
ativo = true
O cliente não pode escolher o próprio perfil.
Normalização do e-mail
Antes de salvar, o e-mail é:
removido de espaços extras;
convertido para letras minúsculas.
Assim, os seguintes valores são tratados como o mesmo usuário:
usuario@email.com
USUARIO@EMAIL.COM
E-mail único
Foi implementada validação para impedir dois usuários com o mesmo e-mail.
A proteção ocorre em dois níveis:
verificação na camada de serviço;
restrição de unicidade no banco.
Em caso de duplicidade, a API retorna:
409 Conflict
Senha criptografada
As senhas são codificadas com BCrypt antes de serem armazenadas.
A senha original nunca é salva diretamente no banco.
Exemplo:
Senha123
é armazenada como um hash semelhante a:
$2a$10$...
A senha também nunca aparece nos DTOs de resposta.

7. Basic Auth
A autenticação inicial foi implementada com Basic Auth.
O Spring Security recebe:
e-mail
senha
e utiliza um UserDetailsService personalizado para localizar o usuário no PostgreSQL.
O processo ocorre da seguinte forma:
Basic Auth
    ↓
UsuarioDetailsService
    ↓
UsuarioRepository
    ↓
PasswordEncoder
    ↓
Autenticação aprovada ou rejeitada
O e-mail é utilizado como username do Spring Security.
Também foi implementada a validação do campo ativo.
Usuários desativados não conseguem se autenticar.

8. JWT
Foi criado o endpoint:
POST /auth/token
O usuário envia as credenciais utilizando Basic Auth.
Após a autenticação, a API devolve um JWT:
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
O token contém informações como:
emissor
usuário
data de emissão
data de expiração
perfil
Exemplo de claims:
{
  "iss": "campus-reserve-api",
  "sub": "usuario@email.com",
  "iat": 1781710000,
  "exp": 1781713600,
  "roles": [
    "ALUNO"
  ]
}
A API utiliza:
JwtEncoder
para criar e assinar o token, e:
JwtDecoder
para validar:
assinatura;
expiração;
emissor;
estrutura do token.
Os endpoints protegidos podem ser acessados utilizando:
Authorization: Bearer TOKEN
A aplicação foi configurada como stateless, portanto não mantém sessões no servidor.

9. Autorização por perfil
Além da autenticação, foram implementadas regras de autorização.
ADMIN
Pode:
consultar recursos;
cadastrar recursos;
atualizar recursos;
excluir recursos;
listar todas as reservas;
consultar qualquer reserva;
aprovar reservas;
rejeitar reservas.
ALUNO e PROFESSOR
Podem:
consultar recursos;
criar reservas;
listar as próprias reservas;
consultar reservas próprias;
cancelar reservas próprias.
Não podem:
cadastrar recursos;
alterar recursos;
excluir recursos;
listar reservas de outros usuários;
aprovar reservas;
rejeitar reservas.
Quando um usuário não autenticado acessa um endpoint protegido, a API retorna:
401 Unauthorized
Quando um usuário autenticado tenta realizar uma operação sem permissão, retorna:
403 Forbidden

10. Administrador inicial
Foi implementada uma rotina de inicialização com ApplicationRunner.
Ela permite criar automaticamente o primeiro administrador utilizando variáveis de ambiente.
As variáveis configuradas são:
INITIAL_ADMIN_ENABLED
INITIAL_ADMIN_NAME
INITIAL_ADMIN_EMAIL
INITIAL_ADMIN_PASSWORD
A rotina verifica se o administrador já existe antes de cadastrá-lo, evitando registros duplicados.
A senha do administrador também é codificada com BCrypt.
Depois da criação, a rotina pode ser desativada.

11. Módulo de reservas
A entidade Reserva possui:
id
usuario
recurso
inicio
fim
quantidadeParticipantes
justificativa
status
Cada reserva pertence a:
um usuário;
um recurso.
Os status disponíveis são:
PENDENTE
APROVADA
REJEITADA
CANCELADA
CONCLUIDA
Toda nova reserva é criada inicialmente como:
PENDENTE

12. Criação de reservas
O endpoint utilizado é:
POST /api/reservas
O usuário não envia seu próprio ID.
O sistema utiliza o usuário presente no Basic Auth ou no JWT:
Authentication.getName()
Assim, um usuário não consegue criar uma reserva em nome de outra pessoa.
Regras implementadas
Para uma reserva ser criada:
o usuário deve estar autenticado;
o recurso deve existir;
o recurso deve estar disponível;
a data de início deve estar no futuro;
a data de fim deve estar no futuro;
o início deve ser anterior ao fim;
a quantidade de participantes deve ser válida;
a capacidade não pode ser excedida;
não pode existir conflito de horário.

13. Conflito de horários
Foi criada uma consulta específica no repository para detectar sobreposição.
Existe conflito quando:
reservaExistente.inicio < novaReserva.fim
E
reservaExistente.fim > novaReserva.inicio
Exemplo com conflito:
Reserva existente: 14:00 até 16:00
Nova reserva:       15:00 até 17:00
Exemplo sem conflito:
Reserva existente: 14:00 até 16:00
Nova reserva:       16:00 até 18:00
Reservas com os status abaixo bloqueiam o horário:
PENDENTE
APROVADA
Reservas nestes status não bloqueiam:
REJEITADA
CANCELADA
Quando há conflito, a API retorna:
409 Conflict

14. Consulta das próprias reservas
Foi criado:
GET /api/reservas/minhas
Esse endpoint retorna somente as reservas pertencentes ao usuário autenticado.
O usuário não informa um ID no caminho ou na requisição.
O sistema identifica o usuário diretamente pelo token.
Caso o usuário não possua reservas, a API retorna:
[]
com status:
200 OK

15. Cancelamento
Foi criado:
PATCH /api/reservas/{id}/cancelar
Regras:
a reserva deve existir;
deve pertencer ao usuário autenticado;
deve estar PENDENTE ou APROVADA;
ainda não pode ter começado.
Após o cancelamento, o status passa para:
CANCELADA
Uma reserva cancelada deixa de bloquear o horário.
Um usuário tentando cancelar uma reserva de outra pessoa recebe:
403 Forbidden
Uma reserva inexistente retorna:
404 Not Found

16. Administração das reservas
Foi criado:
GET /api/reservas
Esse endpoint é exclusivo para ADMIN e retorna as reservas de todos os usuários.
Também foram criados:
PATCH /api/reservas/{id}/aprovar
PATCH /api/reservas/{id}/rejeitar
Somente reservas com status:
PENDENTE
podem ser aprovadas ou rejeitadas.
As transições válidas são:
PENDENTE → APROVADA
PENDENTE → REJEITADA
Reservas aprovadas continuam bloqueando o horário.
Reservas rejeitadas liberam o horário.

17. Consulta individual
Foi criado:
GET /api/reservas/{id}
Regras:
o proprietário pode consultar sua reserva;
o administrador pode consultar qualquer reserva;
outro usuário recebe 403;
reserva inexistente retorna 404.

18. Tratamento global de erros
Foi implementado um GlobalExceptionHandler com @RestControllerAdvice.
Os principais erros tratados são:
recurso não encontrado;
usuário não encontrado;
reserva não encontrada;
e-mail duplicado;
conflito de horário;
reserva inválida;
erro de validação;
JSON inválido;
acesso a reserva de outro usuário.
Também foram criados componentes específicos para erros gerados diretamente pelo Spring Security:
ApiAuthenticationEntryPoint
ApiAccessDeniedHandler
Assim, erros 401 e 403 possuem o mesmo padrão JSON dos demais erros da API.

19. Testes realizados no Postman
Recursos
Cadastro válido
POST /api/recursos
Resultado:
201 Created
Listagem
GET /api/recursos
Resultado:
200 OK
Busca por ID
GET /api/recursos/{id}
Resultados testados:
200 OK
404 Not Found
Atualização
PUT /api/recursos/{id}
Resultados:
200 OK
404 Not Found
Exclusão
DELETE /api/recursos/{id}
Resultados:
204 No Content
404 Not Found
Validação
Foram enviados campos vazios, capacidade inválida e enums inexistentes.
Resultado:
400 Bad Request

Usuários
Cadastro válido
POST /api/usuarios
Resultado:
201 Created
E-mail repetido
Resultado:
409 Conflict
Dados inválidos
Foram testados:
nome vazio;
e-mail inválido;
senha curta.
Resultado:
400 Bad Request
Senha no banco
Foi confirmado diretamente no PostgreSQL que a senha foi armazenada como hash BCrypt.

Basic Auth
Foram testados:
credenciais válidas;
senha incorreta;
e-mail inexistente;
usuário sem autenticação.
Resultados:
200 OK
401 Unauthorized
Também foi confirmado que a API não informa se o erro ocorreu no e-mail ou na senha.

JWT
Geração do token
POST /auth/token
Com Basic Auth válido.
ALUNO -> carlos@email.com	senha: Carlos123 
ADMIN -> ana.souza@email.com	senha: Senha123 
ADMIN: admin@campusreserve.com  Password: Admin123!
Resultado:
200 OK
Token válido
Foi utilizado como Bearer Token nos endpoints protegidos.
Resultado:
200 OK
Token alterado
Um caractere do token foi modificado.
Resultado:
401 Unauthorized
Sem token
Resultado:
401 Unauthorized

Autorização
ALUNO consultando recursos
Resultado:
200 OK
ALUNO cadastrando recurso
Resultado:
403 Forbidden
ADMIN cadastrando recurso
Resultado:
201 Created
ADMIN atualizando recurso
Resultado:
200 OK
ADMIN excluindo recurso
Resultado:
204 No Content

Reservas
Reserva válida
POST /api/reservas
Resultado:
201 Created
Foi confirmado que a reserva ficou vinculada ao usuário autenticado.
Recurso inexistente
Resultado:
404 Not Found
Recurso indisponível
Resultado:
422 Unprocessable Entity
Capacidade excedida
Resultado:
422 Unprocessable Entity
Início posterior ao fim
Resultado:
422 Unprocessable Entity
Conflito de horário
Resultado:
409 Conflict
Horário imediatamente posterior
Foi criada uma reserva começando exatamente quando outra terminava.
Resultado:
201 Created
Sem autenticação
Resultado:
401 Unauthorized

Consulta das reservas
Usuário consultando as próprias reservas
GET /api/reservas/minhas
Resultado:
200 OK
Foi confirmado que usuários diferentes recebem listas diferentes.
ADMIN listando todas as reservas
GET /api/reservas
Resultado:
200 OK
ALUNO tentando listar todas
Resultado:
403 Forbidden

Cancelamento
Proprietário cancelando
PATCH /api/reservas/{id}/cancelar
Resultado:
200 OK
Cancelar novamente
Resultado:
422 Unprocessable Entity
Outro usuário tentando cancelar
Resultado:
403 Forbidden
Reserva inexistente
Resultado:
404 Not Found

Aprovação e rejeição
ADMIN aprovando reserva pendente
PATCH /api/reservas/{id}/aprovar
Resultado:
200 OK
ADMIN rejeitando reserva pendente
PATCH /api/reservas/{id}/rejeitar
Resultado:
200 OK
Aprovar ou rejeitar reserva não pendente
Resultado:
422 Unprocessable Entity
ALUNO tentando aprovar ou rejeitar
Resultado:
403 Forbidden

20. Principais códigos HTTP utilizados
Código
Significado
Situação
200 OK
Operação concluída
consultas, atualizações, cancelamentos
201 Created
Registro criado
usuários, recursos e reservas
204 No Content
Exclusão realizada
exclusão de recurso
400 Bad Request
Dados inválidos
validação e JSON incorreto
401 Unauthorized
Não autenticado
token ou credenciais inválidas
403 Forbidden
Sem permissão
perfil insuficiente
404 Not Found
Registro inexistente
recurso, usuário ou reserva
409 Conflict
Conflito de estado
e-mail ou horário duplicado
422 Unprocessable Entity
Regra de negócio inválida
capacidade, período ou status


21. Estado atual do back-end
O back-end acadêmico está funcional e possui:
API REST
PostgreSQL
Spring Data JPA
arquitetura em camadas
CRUD de recursos
cadastro de usuários
criptografia de senha
Basic Auth
JWT
controle de perfis
reservas
conflito de horários
cancelamento
aprovação
rejeição
tratamento de erros
administrador inicial
O próximo estágio do projeto será o desenvolvimento de um front-end básico capaz de:
cadastrar usuários;
realizar login;
armazenar e enviar o JWT;
listar recursos;
criar reservas;
consultar as próprias reservas;
cancelar reservas;
exibir funções administrativas quando o usuário possuir perfil ADMIN.

