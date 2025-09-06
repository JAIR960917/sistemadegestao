import React from "react";
import jsPDF from "jspdf";

function App() {
  // Estados de autenticação
  const [loggedUser, setLoggedUser] = React.useState(null);
  const [loginData, setLoginData] = React.useState({ email: "", senha: "" });
  const [loginError, setLoginError] = React.useState("");

  const [activeTab, setActiveTab] = React.useState("shop");

  // Configurações do sistema
  const [systemConfig, setSystemConfig] = React.useState({
    name: "Sistema de Gestão",
    primaryColor: "#2563eb",
    secondaryColor: "#10b981",
    logo: null,
    favicon: null,
  });

  // Estados principais - USUÁRIOS AGORA COM SENHA
  const [users, setUsers] = React.useState([
    { id: 1, nome: "João Silva", email: "joao@email.com", senha: "123456", tipo: "cliente" },
    { id: 2, nome: "Admin Sistema", email: "admin@email.com", senha: "admin123", tipo: "admin" },
    { id: 3, nome: "Pedro Costa", email: "pedro@email.com", senha: "pedro123", tipo: "cliente" },
    { id: 4, nome: "Maria Santos", email: "maria@email.com", senha: "maria123", tipo: "cliente" },
  ]);

  const [products, setProducts] = React.useState([
    { id: 1, nome: "Notebook Dell", preco: 2500, categoria: "Eletrônicos", estoque: 10 },
    { id: 2, nome: "Mouse Gamer", preco: 150, categoria: "Acessórios", estoque: 25 },
    { id: 3, nome: "Teclado Mecânico", preco: 300, categoria: "Acessórios", estoque: 15 },
    { id: 4, nome: "Monitor 24\"", preco: 800, categoria: "Eletrônicos", estoque: 8 },
  ]);

  const [orders, setOrders] = React.useState([
    {
      id: 1,
      cliente: "João Silva",
      clienteEmail: "joao@email.com",
      status: "Pendente",
      total: 2650,
      data: "2025-09-01",
      produtos: [
        { nome: "Notebook Dell", preco: 2500, quantidade: 1 },
        { nome: "Mouse Gamer", preco: 150, quantidade: 1 },
      ],
    },
    {
      id: 2,
      cliente: "Pedro Costa",
      clienteEmail: "pedro@email.com",
      status: "Aceito",
      total: 1100,
      data: "2025-09-02",
      produtos: [
        { nome: "Monitor 24\"", preco: 800, quantidade: 1 },
        { nome: "Teclado Mecânico", preco: 300, quantidade: 1 },
      ],
    },
  ]);

  const [services, setServices] = React.useState([
    { id: 1, nome: "Formatação Completa", descricao: "Formatação e instalação do Windows", valor: 100 },
    { id: 2, nome: "Limpeza Interna", descricao: "Limpeza completa do hardware", valor: 80 },
    { id: 3, nome: "Upgrade de Memória", descricao: "Instalação de memória RAM", valor: 50 },
    { id: 4, nome: "Backup de Dados", descricao: "Backup completo dos arquivos", valor: 60 },
  ]);

  const [serviceRequests, setServiceRequests] = React.useState([
    {
      id: 1,
      cliente: "João Silva",
      clienteEmail: "joao@email.com",
      servico: "Formatação Completa",
      status: "Pendente",
      data: "2025-09-02",
      descricao: "Notebook Dell com vírus, precisa formatar",
      valor: 100,
      dataAgendamento: null,
    },
    {
      id: 2,
      cliente: "Pedro Costa",
      clienteEmail: "pedro@email.com",
      servico: "Limpeza Interna",
      status: "Aceito",
      data: "2025-09-01",
      descricao: "PC desktop fazendo muito barulho",
      valor: 80,
      dataAgendamento: "2025-09-10",
    },
  ]);

  const [cart, setCart] = React.useState([]);

  // Estados para modais
  const [showOrderModal, setShowOrderModal] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [showRequestModal, setShowRequestModal] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState(null);

  // Estados para formulários
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [newUser, setNewUser] = React.useState({ nome: "", email: "", senha: "", tipo: "cliente" });
  const [newProduct, setNewProduct] = React.useState({ nome: "", preco: "", categoria: "", estoque: "" });
  const [newService, setNewService] = React.useState({ nome: "", descricao: "", valor: "" });

  // Funções de autenticação
  const login = () => {
    setLoginError("");
    
    if (!loginData.email || !loginData.senha) {
      setLoginError("Por favor, preencha email e senha!");
      return;
    }

    const user = users.find(u => 
      u.email.toLowerCase() === loginData.email.toLowerCase().trim() && 
      u.senha === loginData.senha
    );

    if (user) {
      setLoggedUser(user);
      setLoginData({ email: "", senha: "" });
      setActiveTab(user.tipo === "admin" ? "users" : "shop");
    } else {
      setLoginError("Email ou senha incorretos!");
    }
  };

  const logout = () => {
    setLoggedUser(null);
    setLoginData({ email: "", senha: "" });
    setLoginError("");
    setActiveTab("shop");
  };

  // Favicon dinâmico
  React.useEffect(() => {
    if (systemConfig.favicon) {
      const link = document.querySelector("link[rel='icon']") || document.createElement("link");
      link.rel = "icon";
      link.href = systemConfig.favicon;
      document.head.appendChild(link);
    }
  }, [systemConfig.favicon]);

  // Cores dinâmicas
  React.useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", systemConfig.primaryColor);
    document.documentElement.style.setProperty("--secondary-color", systemConfig.secondaryColor);
  }, [systemConfig.primaryColor, systemConfig.secondaryColor]);

  // Funções CRUD - Usuários (AGORA COM SENHA)
  const addUser = () => {
    if (!newUser.nome || !newUser.email || !newUser.senha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
    
    // Verificar se email já existe
    if (users.find(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      alert("Este email já está cadastrado!");
      return;
    }

    setUsers([...users, { ...newUser, id: Date.now() }]);
    setNewUser({ nome: "", email: "", senha: "", tipo: "cliente" });
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // Funções CRUD - Produtos
  const addProduct = () => {
    if (!newProduct.nome || !newProduct.preco) return;
    setProducts([...products, { 
      ...newProduct, 
      id: Date.now(), 
      preco: parseFloat(newProduct.preco),
      estoque: parseInt(newProduct.estoque) || 0
    }]);
    setNewProduct({ nome: "", preco: "", categoria: "", estoque: "" });
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
    setEditingProduct(null);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Funções CRUD - Serviços
  const addService = () => {
    if (!newService.nome || !newService.valor) return;
    setServices([...services, { 
      ...newService, 
      id: Date.now(), 
      valor: parseFloat(newService.valor)
    }]);
    setNewService({ nome: "", descricao: "", valor: "" });
  };

  const deleteService = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  // Funções do carrinho
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const checkout = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.preco, 0);
    const newOrder = {
      id: Date.now(),
      cliente: loggedUser.nome,
      clienteEmail: loggedUser.email,
      status: "Pendente",
      total,
      data: new Date().toISOString().split('T')[0],
      produtos: cart.map(item => ({ ...item, quantidade: 1 }))
    };
    setOrders([...orders, newOrder]);
    setCart([]);
    alert("Pedido realizado com sucesso!");
  };

  // Relatório PDF
  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(systemConfig.name + " - Relatório Completo", 14, 20);
    
    let y = 35;
    
    // Resumo geral
    doc.setFontSize(14);
    doc.text("📊 RESUMO GERAL", 14, y);
    y += 10;
    
    doc.setFontSize(11);
    doc.text(`Total de Usuários: ${users.length}`, 14, y);
    y += 6;
    doc.text(`Total de Produtos: ${products.length}`, 14, y);
    y += 6;
    doc.text(`Total de Pedidos: ${orders.length}`, 14, y);
    y += 6;
    doc.text(`Total de Serviços: ${services.length}`, 14, y);
    y += 6;
    doc.text(`Total de Solicitações: ${serviceRequests.length}`, 14, y);
    y += 15;

    // Pedidos detalhados
    doc.setFontSize(14);
    doc.text("📦 PEDIDOS DETALHADOS", 14, y);
    y += 10;

    let totalPedidos = 0;
    orders.forEach((order) => {
      doc.setFontSize(10);
      doc.text(`Pedido #${order.id} - ${order.cliente}`, 14, y);
      y += 5;
      doc.text(`Data: ${order.data} | Status: ${order.status} | Total: R$ ${order.total}`, 20, y);
      y += 5;
      
      order.produtos.forEach((produto) => {
        doc.text(`  • ${produto.nome} - R$ ${produto.preco} (Qtd: ${produto.quantidade})`, 25, y);
        y += 4;
      });
      
      totalPedidos += order.total;
      y += 3;
      
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    y += 10;
    doc.setFontSize(14);
    doc.text("🛠 SERVIÇOS REALIZADOS", 14, y);
    y += 10;

    let totalServicos = 0;
    serviceRequests.filter(s => s.status === "Aceito").forEach((request) => {
      doc.setFontSize(10);
      doc.text(`Serviço #${request.id} - ${request.cliente}`, 14, y);
      y += 5;
      doc.text(`Serviço: ${request.servico} | Valor: R$ ${request.valor}`, 20, y);
      y += 5;
      doc.text(`Data: ${request.data} | Agendamento: ${request.dataAgendamento || 'N/A'}`, 20, y);
      y += 5;
      doc.text(`Descrição: ${request.descricao}`, 20, y);
      y += 8;
      
      totalServicos += request.valor;
      
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // Totais finais
    y += 10;
    doc.setFontSize(12);
    doc.text(`💰 TOTAL PEDIDOS: R$ ${totalPedidos.toFixed(2)}`, 14, y);
    y += 8;
    doc.text(`💰 TOTAL SERVIÇOS: R$ ${totalServicos.toFixed(2)}`, 14, y);
    y += 8;
    doc.setFontSize(14);
    doc.text(`🏆 FATURAMENTO TOTAL: R$ ${(totalPedidos + totalServicos).toFixed(2)}`, 14, y);

    doc.save(`relatorio-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // TELA DE LOGIN
  if (!loggedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🔐 Login</h1>
            <p className="text-gray-600">{systemConfig.name}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Digite seu email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && login()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={loginData.senha}
                onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && login()}
              />
            </div>
            
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                ❌ {loginError}
              </div>
            )}
            
            <button
              onClick={login}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Entrar
            </button>
          </div>
          
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header
        className="flex justify-between items-center px-6 py-4 shadow-md"
        style={{ backgroundColor: systemConfig.primaryColor, color: "white" }}
      >
        <div className="flex items-center">
          {systemConfig.logo && (
            <img src={systemConfig.logo} alt="Logo" className="h-10 mr-3 rounded" />
          )}
          <div>
            <h1 className="text-2xl font-bold">{systemConfig.name}</h1>
            <p className="text-sm opacity-90">Bem-vindo, {loggedUser.nome}!</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm ${
            loggedUser.tipo === "admin" ? "bg-purple-500" : "bg-green-500"
          }`}>
            {loggedUser.tipo === "admin" ? "👑 Admin" : "👤 Cliente"}
          </span>
          <button
            onClick={logout}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            🚪 Sair
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav
        className="flex gap-6 px-6 py-3 shadow-sm"
        style={{ backgroundColor: systemConfig.secondaryColor }}
      >
        {loggedUser.tipo === "cliente" ? (
          <>
            <button 
              onClick={() => setActiveTab("shop")} 
              className={`text-white px-3 py-1 rounded ${activeTab === "shop" ? "bg-black bg-opacity-20" : ""}`}
            >
              🛍 Loja
            </button>
            <button 
              onClick={() => setActiveTab("orders")} 
              className={`text-white px-3 py-1 rounded ${activeTab === "orders" ? "bg-black bg-opacity-20" : ""}`}
            >
              📦 Meus Pedidos
            </button>
            <button 
              onClick={() => setActiveTab("requests")} 
              className={`text-white px-3 py-1 rounded ${activeTab === "requests" ? "bg-black bg-opacity-20" : ""}`}
            >
              🛠 Solicitações
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setActiveTab("users")} 
              className={`text-white px-3 py-1 rounded ${activeTab === "users" ? "bg-black bg-opacity-20" : ""}`}
            >
              👥 Usuários
            </button>
            <button 
              onClick={() => setActiveTab("products")} 
              className={`text-white px-3 py-1 rounded ${activeTab === "products" ? "bg-black bg-opacity-20" : ""}`}
            >
              📦 Produtos
            </button>
            <button 
              onClick={() => setActiveTab("adminOrders")} 
              className={`text-white px-3 py-1 rounded ${activeTab === "adminOrders" ? "bg-black bg-opacity-20" : ""}`}
            >
              📋 Pedidos
            </button>
            <button 
              onClick={() => setActiveTab("services")} 
              className={`text-white px-3 py-1 rounded ${activeTab === "services" ? "bg-black bg-opacity-20" : ""}`}
            >
              🛠 Serviços
            </button>
            <button 
              onClick={() => setActiveTab("adminRequests")} 
              className={`text-white px-3 py-1 rounded ${activeTab === "adminRequests" ? "bg-black bg-opacity-20" : ""}`}
            >
              📝 Solicitações
            </button>
            <button 
              onClick={() => setActiveTab("config")} 
              className={`text-white px-3 py-1 rounded ${activeTab === "config" ? "bg-black bg-opacity-20" : ""}`}
            >
              ⚙ Configurações
            </button>
            <button 
              onClick={generateReport} 
              className="text-white px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-700"
            >
              📄 Relatório
            </button>
          </>
        )}
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {loggedUser.tipo === "cliente" ? (
          <>
            {activeTab === "shop" && (
              <ClientShop 
                products={products} 
                cart={cart} 
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                checkout={checkout}
              />
            )}
            {activeTab === "orders" && (
              <ClientOrders 
                orders={orders.filter(o => o.clienteEmail === loggedUser.email)} 
                setOrders={setOrders}
                setShowOrderModal={setShowOrderModal}
                setSelectedOrder={setSelectedOrder}
              />
            )}
            {activeTab === "requests" && (
              <ClientRequests
                requests={serviceRequests.filter(r => r.clienteEmail === loggedUser.email)}
                setRequests={setServiceRequests}
                services={services}
                loggedUser={loggedUser}
              />
            )}
          </>
        ) : (
          <>
            {activeTab === "users" && (
              <AdminUsers 
                users={users} 
                newUser={newUser}
                setNewUser={setNewUser}
                addUser={addUser}
                deleteUser={deleteUser}
              />
            )}
            {activeTab === "products" && (
              <AdminProducts 
                products={products}
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                addProduct={addProduct}
                deleteProduct={deleteProduct}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
                updateProduct={updateProduct}
              />
            )}
            {activeTab === "adminOrders" && (
              <AdminOrders 
                orders={orders} 
                setOrders={setOrders}
                setShowOrderModal={setShowOrderModal}
                setSelectedOrder={setSelectedOrder}
              />
            )}
            {activeTab === "services" && (
              <AdminServices 
                services={services}
                newService={newService}
                setNewService={setNewService}
                addService={addService}
                deleteService={deleteService}
              />
            )}
            {activeTab === "adminRequests" && (
              <AdminRequests
                serviceRequests={serviceRequests}
                setServiceRequests={setServiceRequests}
                setShowRequestModal={setShowRequestModal}
                setSelectedRequest={setSelectedRequest}
              />
            )}
            {activeTab === "config" && (
              <AdminConfig
                systemConfig={systemConfig}
                setSystemConfig={setSystemConfig}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showOrderModal && selectedOrder && (
        <OrderModal 
          order={selectedOrder} 
          onClose={() => setShowOrderModal(false)} 
        />
      )}
      
      {showRequestModal && selectedRequest && (
        <RequestModal 
          request={selectedRequest} 
          onClose={() => setShowRequestModal(false)} 
        />
      )}
    </div>
  );
}

// Componentes Client
const ClientShop = ({ products, cart, addToCart, removeFromCart, checkout }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-bold mb-4">🛍 Loja</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg">{product.nome}</h3>
            <p className="text-gray-600">{product.categoria}</p>
            <p className="text-2xl font-bold text-green-600">R$ {product.preco}</p>
            <p className="text-sm text-gray-500">Estoque: {product.estoque}</p>
            <button
              onClick={() => addToCart(product)}
              disabled={product.estoque === 0}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {product.estoque === 0 ? "Sem Estoque" : "Adicionar ao Carrinho"}
            </button>
          </div>
        ))}
      </div>
    </div>
    
    <div className="bg-white p-4 rounded-lg shadow h-fit">
      <h3 className="text-xl font-bold mb-4">🛒 Carrinho</h3>
      {cart.length === 0 ? (
        <p className="text-gray-500">Carrinho vazio</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>{item.nome}</span>
              <div className="flex items-center gap-2">
                <span>R$ {item.preco}</span>
                <button
                  onClick={() => removeFromCart(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
          <hr className="my-3" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>R$ {cart.reduce((sum, item) => sum + item.preco, 0)}</span>
          </div>
          <button
            onClick={checkout}
            className="w-full mt-3 bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Finalizar Compra
          </button>
        </>
      )}
    </div>
  </div>
);

const ClientOrders = ({ orders, setOrders, setShowOrderModal, setSelectedOrder }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">📦 Meus Pedidos</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Pedido</th>
            <th className="px-4 py-3 text-left">Data</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Total</th>
            <th className="px-4 py-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="px-4 py-3">#{order.id}</td>
              <td className="px-4 py-3">{order.data}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  order.status === "Pendente" ? "bg-yellow-100 text-yellow-800" :
                  order.status === "Aceito" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3">R$ {order.total}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Ver Detalhes
                </button>
                {order.status === "Pendente" && (
                  <button
                    onClick={() => setOrders(prev => 
                      prev.map(o => o.id === order.id ? {...o, status: "Cancelado"} : o)
                    )}
                    className="text-red-500 hover:text-red-700"
                  >
                    Cancelar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ClientRequests = ({ requests, setRequests, services, loggedUser }) => {
  const [newRequest, setNewRequest] = React.useState({ servico: "", descricao: "" });

  const submitRequest = () => {
    if (!newRequest.servico || !newRequest.descricao) return;
    const service = services.find(s => s.nome === newRequest.servico);
    setRequests(prev => [...prev, {
      id: Date.now(),
      cliente: loggedUser.nome,
      clienteEmail: loggedUser.email,
      servico: newRequest.servico,
      descricao: newRequest.descricao,
      valor: service.valor,
      status: "Pendente",
      data: new Date().toISOString().split('T')[0],
      dataAgendamento: null
    }]);
    setNewRequest({ servico: "", descricao: "" });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🛠 Minhas Solicitações</h2>
      
      {/* Formulário */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-bold mb-3">Nova Solicitação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={newRequest.servico}
            onChange={(e) => setNewRequest({...newRequest, servico: e.target.value})}
            className="border rounded px-3 py-2"
          >
            <option value="">Selecione um serviço</option>
            {services.map(service => (
              <option key={service.id} value={service.nome}>
                {service.nome} - R$ {service.valor}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Descrição detalhada"
            value={newRequest.descricao}
            onChange={(e) => setNewRequest({...newRequest, descricao: e.target.value})}
            className="border rounded px-3 py-2"
          />
        </div>
        <button
          onClick={submitRequest}
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Solicitar Serviço
        </button>
      </div>

      {/* Lista de solicitações */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Serviço</th>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Valor</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-t">
                <td className="px-4 py-3">{request.servico}</td>
                <td className="px-4 py-3">{request.data}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    request.status === "Pendente" ? "bg-yellow-100 text-yellow-800" :
                    request.status === "Aceito" ? "bg-green-100 text-green-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-4 py-3">R$ {request.valor}</td>
                <td className="px-4 py-3">
                  {request.status === "Pendente" && (
                    <button
                      onClick={() => setRequests(prev => 
                        prev.map(r => r.id === request.id ? {...r, status: "Cancelado"} : r)
                      )}
                      className="text-red-500 hover:text-red-700"
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componentes Admin
const AdminUsers = ({ users, newUser, setNewUser, addUser, deleteUser }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">👥 Gerenciar Usuários</h2>
    
    {/* Formulário */}
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-bold mb-3">Novo Usuário</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Nome"
          value={newUser.nome}
          onChange={(e) => setNewUser({...newUser, nome: e.target.value})}
          className="border rounded px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Senha"
          value={newUser.senha}
          onChange={(e) => setNewUser({...newUser, senha: e.target.value})}
          className="border rounded px-3 py-2"
        />
        <select
          value={newUser.tipo}
          onChange={(e) => setNewUser({...newUser, tipo: e.target.value})}
          className="border rounded px-3 py-2"
        >
          <option value="cliente">Cliente</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button
        onClick={addUser}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Adicionar Usuário
      </button>
    </div>

    {/* Lista */}
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Nome</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Tipo</th>
            <th className="px-4 py-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-3">{user.nome}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  user.tipo === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                }`}>
                  {user.tipo}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminProducts = ({ products, newProduct, setNewProduct, addProduct, deleteProduct, editingProduct, setEditingProduct, updateProduct }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">📦 Gerenciar Produtos</h2>
    
    {/* Formulário */}
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-bold mb-3">Novo Produto</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Nome"
          value={newProduct.nome}
          onChange={(e) => setNewProduct({...newProduct, nome: e.target.value})}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Preço"
          value={newProduct.preco}
          onChange={(e) => setNewProduct({...newProduct, preco: e.target.value})}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Categoria"
          value={newProduct.categoria}
          onChange={(e) => setNewProduct({...newProduct, categoria: e.target.value})}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Estoque"
          value={newProduct.estoque}
          onChange={(e) => setNewProduct({...newProduct, estoque: e.target.value})}
          className="border rounded px-3 py-2"
        />
      </div>
      <button
        onClick={addProduct}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Adicionar Produto
      </button>
    </div>

    {/* Lista */}
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Nome</th>
            <th className="px-4 py-3 text-left">Preço</th>
            <th className="px-4 py-3 text-left">Categoria</th>
            <th className="px-4 py-3 text-left">Estoque</th>
            <th className="px-4 py-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-3">
                {editingProduct === product.id ? (
                  <input
                    type="text"
                    defaultValue={product.nome}
                    onBlur={(e) => updateProduct(product.id, {nome: e.target.value})}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  product.nome
                )}
              </td>
              <td className="px-4 py-3">
                {editingProduct === product.id ? (
                  <input
                    type="number"
                    defaultValue={product.preco}
                    onBlur={(e) => updateProduct(product.id, {preco: parseFloat(e.target.value)})}
                    className="border rounded px-2 py-1 w-20"
                  />
                ) : (
                  `R$ ${product.preco}`
                )}
              </td>
              <td className="px-4 py-3">
                {editingProduct === product.id ? (
                  <input
                    type="text"
                    defaultValue={product.categoria}
                    onBlur={(e) => updateProduct(product.id, {categoria: e.target.value})}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  product.categoria
                )}
              </td>
              <td className="px-4 py-3">
                {editingProduct === product.id ? (
                  <input
                    type="number"
                    defaultValue={product.estoque}
                    onBlur={(e) => updateProduct(product.id, {estoque: parseInt(e.target.value)})}
                    className="border rounded px-2 py-1 w-16"
                  />
                ) : (
                  product.estoque
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => setEditingProduct(editingProduct === product.id ? null : product.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  {editingProduct === product.id ? "Salvar" : "Editar"}
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminOrders = ({ orders, setOrders, setShowOrderModal, setSelectedOrder }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">📋 Gerenciar Pedidos</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Pedido</th>
            <th className="px-4 py-3 text-left">Cliente</th>
            <th className="px-4 py-3 text-left">Data</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Total</th>
            <th className="px-4 py-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="px-4 py-3">#{order.id}</td>
              <td className="px-4 py-3">{order.cliente}</td>
              <td className="px-4 py-3">{order.data}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  order.status === "Pendente" ? "bg-yellow-100 text-yellow-800" :
                  order.status === "Aceito" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3">R$ {order.total}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Detalhes
                </button>
                {order.status === "Pendente" && (
                  <>
                    <button
                      onClick={() => setOrders(prev => 
                        prev.map(o => o.id === order.id ? {...o, status: "Aceito"} : o)
                      )}
                      className="text-green-500 hover:text-green-700 mr-2"
                    >
                      Aceitar
                    </button>
                    <button
                      onClick={() => setOrders(prev => 
                        prev.map(o => o.id === order.id ? {...o, status: "Rejeitado"} : o)
                      )}
                      className="text-red-500 hover:text-red-700"
                    >
                      Rejeitar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminServices = ({ services, newService, setNewService, addService, deleteService }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">🛠 Gerenciar Serviços</h2>
    
    {/* Formulário */}
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-bold mb-3">Novo Serviço</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Nome do serviço"
          value={newService.nome}
          onChange={(e) => setNewService({...newService, nome: e.target.value})}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Descrição"
          value={newService.descricao}
          onChange={(e) => setNewService({...newService, descricao: e.target.value})}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Valor"
          value={newService.valor}
          onChange={(e) => setNewService({...newService, valor: e.target.value})}
          className="border rounded px-3 py-2"
        />
      </div>
      <button
        onClick={addService}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Adicionar Serviço
      </button>
    </div>

    {/* Lista */}
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Nome</th>
            <th className="px-4 py-3 text-left">Descrição</th>
            <th className="px-4 py-3 text-left">Valor</th>
            <th className="px-4 py-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-t">
              <td className="px-4 py-3">{service.nome}</td>
              <td className="px-4 py-3">{service.descricao}</td>
              <td className="px-4 py-3">R$ {service.valor}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => deleteService(service.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminRequests = ({ serviceRequests, setServiceRequests, setShowRequestModal, setSelectedRequest }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">📝 Gerenciar Solicitações</h2>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Cliente</th>
            <th className="px-4 py-3 text-left">Serviço</th>
            <th className="px-4 py-3 text-left">Data</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Valor</th>
            <th className="px-4 py-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {serviceRequests.map((request) => (
            <tr key={request.id} className="border-t">
              <td className="px-4 py-3">{request.cliente}</td>
              <td className="px-4 py-3">{request.servico}</td>
              <td className="px-4 py-3">{request.data}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  request.status === "Pendente" ? "bg-yellow-100 text-yellow-800" :
                  request.status === "Aceito" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {request.status}
                </span>
              </td>
              <td className="px-4 py-3">R$ {request.valor}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowRequestModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Detalhes
                </button>
                {request.status === "Pendente" && (
                  <>
                    <button
                      onClick={() => setServiceRequests(prev => 
                        prev.map(r => r.id === request.id ? {...r, status: "Aceito"} : r)
                      )}
                      className="text-green-500 hover:text-green-700 mr-2"
                    >
                      Aceitar
                    </button>
                    <button
                      onClick={() => setServiceRequests(prev => 
                        prev.map(r => r.id === request.id ? {...r, status: "Rejeitado"} : r)
                      )}
                      className="text-red-500 hover:text-red-700"
                    >
                      Rejeitar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminConfig = ({ systemConfig, setSystemConfig }) => {
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setSystemConfig(prev => ({ ...prev, [type]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">⚙ Configurações do Sistema</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nome do Sistema</label>
            <input
              type="text"
              value={systemConfig.name}
              onChange={(e) => setSystemConfig(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Cor Primária</label>
            <input
              type="color"
              value={systemConfig.primaryColor}
              onChange={(e) => setSystemConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
              className="w-full border rounded px-3 py-2 h-10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Cor Secundária</label>
            <input
              type="color"
              value={systemConfig.secondaryColor}
              onChange={(e) => setSystemConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
              className="w-full border rounded px-3 py-2 h-10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'logo')}
              className="w-full border rounded px-3 py-2"
            />
            {systemConfig.logo && (
              <img src={systemConfig.logo} alt="Logo" className="mt-2 h-16 rounded" />
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Favicon</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'favicon')}
              className="w-full border rounded px-3 py-2"
            />
            {systemConfig.favicon && (
              <img src={systemConfig.favicon} alt="Favicon" className="mt-2 h-8 rounded" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modals
const OrderModal = ({ order, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Detalhes do Pedido #{order.id}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      
      <div className="space-y-3">
        <p><strong>Cliente:</strong> {order.cliente}</p>
        <p><strong>Email:</strong> {order.clienteEmail}</p>
        <p><strong>Data:</strong> {order.data}</p>
        <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm ${
          order.status === "Pendente" ? "bg-yellow-100 text-yellow-800" :
          order.status === "Aceito" ? "bg-green-100 text-green-800" :
          "bg-red-100 text-red-800"
        }`}>{order.status}</span></p>
        
        <div>
          <strong>Produtos:</strong>
          <ul className="mt-2 space-y-1">
            {order.produtos.map((produto, index) => (
              <li key={index} className="flex justify-between">
                <span>{produto.nome} (x{produto.quantidade})</span>
                <span>R$ {produto.preco}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t pt-3">
          <p className="text-lg font-bold">Total: R$ {order.total}</p>
        </div>
      </div>
      
      <button
        onClick={onClose}
        className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
      >
        Fechar
      </button>
    </div>
  </div>
);

const RequestModal = ({ request, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Detalhes da Solicitação #{request.id}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      
      <div className="space-y-3">
        <p><strong>Cliente:</strong> {request.cliente}</p>
        <p><strong>Email:</strong> {request.clienteEmail}</p>
        <p><strong>Serviço:</strong> {request.servico}</p>
        <p><strong>Data da Solicitação:</strong> {request.data}</p>
        <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm ${
          request.status === "Pendente" ? "bg-yellow-100 text-yellow-800" :
          request.status === "Aceito" ? "bg-green-100 text-green-800" :
          "bg-red-100 text-red-800"
        }`}>{request.status}</span></p>
        {request.dataAgendamento && (
          <p><strong>Data Agendada:</strong> {request.dataAgendamento}</p>
        )}
        <p><strong>Descrição:</strong> {request.descricao}</p>
        <p><strong>Valor:</strong> R$ {request.valor}</p>
      </div>
      
      <button
        onClick={onClose}
        className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
      >
        Fechar
      </button>
    </div>
  </div>
);

export default App;