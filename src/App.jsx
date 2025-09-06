import React from "react";
import jsPDF from "jspdf";

function App() {
  const [activeTab, setActiveTab] = React.useState("client");
  const [currentUser, setCurrentUser] = React.useState("client"); // client ou admin

  // --------------------------
  // Estado de Configurações do Sistema
  // --------------------------
  const [systemConfig, setSystemConfig] = React.useState({
    name: "Sistema de Gestão",
    primaryColor: "#2563eb", // azul
    secondaryColor: "#10b981", // verde
    logo: null,
    favicon: null,
  });

  // --------------------------
  // Estados de Dados
  // --------------------------
  const [users, setUsers] = React.useState([
    { id: 1, nome: "João Silva", email: "joao@email.com", tipo: "cliente" },
    { id: 2, nome: "Maria Santos", email: "maria@email.com", tipo: "admin" },
  ]);

  const [products, setProducts] = React.useState([
    { id: 1, nome: "Notebook Dell", preco: 2500, categoria: "Eletrônicos" },
    { id: 2, nome: "Mouse Gamer", preco: 150, categoria: "Acessórios" },
  ]);

  const [orders, setOrders] = React.useState([
    {
      id: 1,
      cliente: "João Silva",
      status: "Pendente",
      total: 250,
      data: "2024-01-15",
      produtos: [
        { nome: "Placa de vídeo", preco: 150 },
        { nome: "Fonte 500W", preco: 100 },
      ],
    },
    {
      id: 2,
      cliente: "Maria Santos",
      status: "Concluído",
      total: 400,
      data: "2024-01-10",
      produtos: [{ nome: "Notebook", preco: 400 }],
    },
  ]);

  const [services, setServices] = React.useState([
    { id: 1, nome: "Manutenção", descricao: "Serviço de manutenção geral", valor: 100 },
    { id: 2, nome: "Instalação", descricao: "Instalação de software", valor: 50 },
  ]);

  const [serviceRequests, setServiceRequests] = React.useState([
    {
      id: 1,
      cliente: "João Silva",
      servico: "Manutenção",
      status: "Pendente",
      data: "2024-01-20",
      descricao: "Manutenção preventiva do sistema",
      valor: 100,
    },
  ]);

  const [cart, setCart] = React.useState([]);

  // -----------------------
  // Atualizar Favicon
  // -----------------------
  React.useEffect(() => {
    if (systemConfig.favicon) {
      const link =
        document.querySelector("link[rel='icon']") ||
        document.createElement("link");
      link.rel = "icon";
      link.href = systemConfig.favicon;
      document.head.appendChild(link);
    }
  }, [systemConfig.favicon]);

  // -----------------------
  // Gerar Relatório PDF
  // -----------------------
  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(systemConfig.name + " - Relatório Completo", 14, 20);

    let y = 30;

    // Seção Pedidos
    doc.setFontSize(14);
    doc.text("📦 Pedidos de Produtos", 14, y);
    y += 8;

    let totalPedidos = 0;
    orders.forEach((o, i) => {
      doc.setFontSize(11);
      doc.text(
        `${i + 1}. Cliente: ${o.cliente} | Status: ${o.status} | Data: ${o.data} | Total: R$ ${o.total}`,
        14,
        y
      );
      y += 6;
      o.produtos.forEach((p) => {
        doc.text(`   • ${p.nome} - R$ ${p.preco}`, 20, y);
        y += 5;
      });
      totalPedidos += o.total;
      y += 3;
    });

    y += 5;
    doc.setFontSize(12);
    doc.text(`💰 Total em Pedidos: R$ ${totalPedidos}`, 14, y);

    // Seção Serviços Realizados
    y += 15;
    doc.setFontSize(14);
    doc.text("🛠️ Serviços Realizados", 14, y);
    y += 8;

    let totalServicos = 0;
    serviceRequests
      .filter(s => s.status === "Aceito")
      .forEach((s, i) => {
        doc.setFontSize(11);
        doc.text(
          `${i + 1}. Cliente: ${s.cliente} | Serviço: ${s.servico} | Data: ${s.data} | Valor: R$ ${s.valor}`,
          14,
          y
        );
        y += 6;
        doc.text(`   Descrição: ${s.descricao}`, 20, y);
        y += 6;
        totalServicos += s.valor;
      });

    y += 5;
    doc.setFontSize(12);
    doc.text(`💰 Total em Serviços: R$ ${totalServicos}`, 14, y);

    // Total Geral
    y += 10;
    doc.setFontSize(14);
    doc.text(`🏆 TOTAL GERAL: R$ ${totalPedidos + totalServicos}`, 14, y);

    doc.save(`${systemConfig.name.replace(/\s+/g, '_')}_relatorio.pdf`);
  };

  // -----------------------
  // RENDER APP
  // -----------------------
  return (
    <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
      {/* HEADER com Logo, Nome e cor configurável */}
      <header
        className="flex items-center justify-between px-6 py-3 shadow"
        style={{ backgroundColor: systemConfig.primaryColor, color: "white" }}
      >
        <div className="flex items-center">
          {systemConfig.logo && (
            <img src={systemConfig.logo} alt="Logo" className="h-10 mr-3" />
          )}
          <h1 className="text-xl font-bold">{systemConfig.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <span>Usuário: {currentUser === "client" ? "Cliente" : "Admin"}</span>
          <button
            onClick={() => setCurrentUser(currentUser === "client" ? "admin" : "client")}
            className="px-3 py-1 bg-white text-black rounded"
          >
            Trocar para {currentUser === "client" ? "Admin" : "Cliente"}
          </button>
        </div>
      </header>

      {/* MENU */}
      <nav
        className="flex gap-4 px-6 py-3 shadow"
        style={{ backgroundColor: systemConfig.secondaryColor }}
      >
        {currentUser === "client" ? (
          <>
            <button onClick={() => setActiveTab("shop")} className="text-white">
              🛍️ Loja
            </button>
            <button onClick={() => setActiveTab("orders")} className="text-white">
              📦 Meus Pedidos
            </button>
            <button onClick={() => setActiveTab("service-requests")} className="text-white">
              🛠️ Meus Serviços
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setActiveTab("users")} className="text-white">
              👥 Usuários
            </button>
            <button onClick={() => setActiveTab("products")} className="text-white">
              📦 Produtos
            </button>
            <button onClick={() => setActiveTab("admin-orders")} className="text-white">
              📋 Pedidos
            </button>
            <button onClick={() => setActiveTab("services")} className="text-white">
              🛠️ Serviços
            </button>
            <button onClick={() => setActiveTab("requests")} className="text-white">
              📝 Solicitações
            </button>
            <button onClick={() => setActiveTab("config")} className="text-white">
              ⚙️ Configurações
            </button>
            <button onClick={generateReport} className="text-white">
              📄 Relatório
            </button>
          </>
        )}
      </nav>

      {/* CONTEÚDO */}
      <main className="p-6">
        {currentUser === "client" ? (
          <>
            {activeTab === "shop" && (
              <ClientShop
                products={products}
                cart={cart}
                setCart={setCart}
                theme={systemConfig}
              />
            )}
            {activeTab === "orders" && (
              <ClientOrders
                orders={orders.filter(o => o.cliente === "João Silva")}
                setOrders={setOrders}
                theme={systemConfig}
              />
            )}
            {activeTab === "service-requests" && (
              <ClientServiceRequests
                serviceRequests={serviceRequests.filter(s => s.cliente === "João Silva")}
                setServiceRequests={setServiceRequests}
                services={services}
                theme={systemConfig}
              />
            )}
          </>
        ) : (
          <>
            {activeTab === "users" && (
              <AdminUsers users={users} setUsers={setUsers} />
            )}
            {activeTab === "products" && (
              <AdminProducts products={products} setProducts={setProducts} />
            )}
            {activeTab === "admin-orders" && (
              <AdminOrders orders={orders} setOrders={setOrders} />
            )}
            {activeTab === "services" && (
              <AdminServices services={services} setServices={setServices} />
            )}
            {activeTab === "requests" && (
              <AdminRequests
                serviceRequests={serviceRequests}
                setServiceRequests={setServiceRequests}
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
    </div>
  );
}

// =============================
// CLIENT - LOJA
// =============================
const ClientShop = ({ products, cart, setCart, theme }) => {
  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const checkout = () => {
    if (cart.length === 0) {
      alert("Carrinho vazio!");
      return;
    }
    alert(`Pedido realizado! Total: R$ ${cart.reduce((sum, p) => sum + p.preco, 0)}`);
    setCart([]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4" style={{ color: theme.primaryColor }}>
        🛍️ Loja - Produtos Disponíveis
      </h2>
      
      <div className="mb-4 p-4 bg-white rounded shadow">
        <h3 className="font-bold">🛒 Carrinho ({cart.length} itens)</h3>
        <p>Total: R$ {cart.reduce((sum, p) => sum + p.preco, 0)}</p>
        <button
          onClick={checkout}
          style={{ backgroundColor: theme.secondaryColor }}
          className="mt-2 px-4 py-2 text-white rounded"
        >
          Finalizar Compra
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{product.nome}</h3>
            <p className="text-gray-600">{product.categoria}</p>
            <p className="text-lg font-bold">R$ {product.preco}</p>
            <button
              onClick={() => addToCart(product)}
              style={{ backgroundColor: theme.primaryColor }}
              className="mt-2 px-4 py-2 text-white rounded"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================
// CLIENT - PEDIDOS
// =============================
const ClientOrders = ({ orders, setOrders, theme }) => {
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const cancelarPedido = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "Cancelado" } : order
      )
    );
    setSelectedOrder(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4" style={{ color: theme.primaryColor }}>
        📦 Meus Pedidos
      </h2>

      <table className="min-w-full bg-white rounded shadow">
        <thead style={{ backgroundColor: theme.secondaryColor, color: "white" }}>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Data</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.data}</td>
              <td className="px-4 py-2">R$ {order.total}</td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  style={{ backgroundColor: theme.primaryColor }}
                  className="px-3 py-1 text-white rounded"
                >
                  Ver Detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              Detalhes do Pedido #{selectedOrder.id}
            </h3>
            <p><strong>Data:</strong> {selectedOrder.data}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <h4 className="font-bold mt-4 mb-2">Produtos:</h4>
            <ul className="mb-4">
              {selectedOrder.produtos.map((p, idx) => (
                <li key={idx}>🛍️ {p.nome} - R$ {p.preco}</li>
              ))}
            </ul>
            <p className="font-semibold">💰 Total: R$ {selectedOrder.total}</p>

            {selectedOrder.status === "Pendente" && (
              <button
                onClick={() => cancelarPedido(selectedOrder.id)}
                style={{ backgroundColor: theme.secondaryColor }}
                className="mt-4 px-4 py-2 text-white rounded"
              >
                Cancelar Pedido
              </button>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 ml-2 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================
// CLIENT - SOLICITAÇÕES DE SERVIÇO
// =============================
const ClientServiceRequests = ({ serviceRequests, setServiceRequests, services, theme }) => {
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [newRequest, setNewRequest] = React.useState({
    servico: "",
    descricao: "",
  });

  const submitRequest = () => {
    if (!newRequest.servico || !newRequest.descricao) {
      alert("Preencha todos os campos!");
      return;
    }

    const service = services.find(s => s.nome === newRequest.servico);
    const request = {
      id: Date.now(),
      cliente: "João Silva",
      servico: newRequest.servico,
      status: "Pendente",
      data: new Date().toISOString().split('T')[0],
      descricao: newRequest.descricao,
      valor: service?.valor || 0,
    };

    setServiceRequests(prev => [...prev, request]);
    setNewRequest({ servico: "", descricao: "" });
    alert("Solicitação enviada!");
  };

  const cancelRequest = (id) => {
    setServiceRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status: "Cancelado" } : req)
    );
    setSelectedRequest(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4" style={{ color: theme.primaryColor }}>
        🛠️ Meus Serviços
      </h2>

      {/* Formulário para nova solicitação */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-bold mb-4">Solicitar Novo Serviço</h3>
        <select
          value={newRequest.servico}
          onChange={(e) => setNewRequest({ ...newRequest, servico: e.target.value })}
          className="border px-2 py-1 mr-2 mb-2"
        >
          <option value="">Selecione um serviço</option>
          {services.map(service => (
            <option key={service.id} value={service.nome}>
              {service.nome} - R$ {service.valor}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Descreva sua necessidade..."
          value={newRequest.descricao}
          onChange={(e) => setNewRequest({ ...newRequest, descricao: e.target.value })}
          className="border px-2 py-1 w-full mb-2"
          rows="3"
        />
        <button
          onClick={submitRequest}
          style={{ backgroundColor: theme.primaryColor }}
          className="px-4 py-2 text-white rounded"
        >
          Enviar Solicitação
        </button>
      </div>

      {/* Lista de solicitações */}
      <table className="min-w-full bg-white rounded shadow">
        <thead style={{ backgroundColor: theme.secondaryColor, color: "white" }}>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Serviço</th>
            <th className="px-4 py-2">Data</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {serviceRequests.map(request => (
            <tr key={request.id} className="border-b">
              <td className="px-4 py-2">{request.id}</td>
              <td className="px-4 py-2">{request.servico}</td>
              <td className="px-4 py-2">{request.data}</td>
              <td className="px-4 py-2">{request.status}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => setSelectedRequest(request)}
                  style={{ backgroundColor: theme.primaryColor }}
                  className="px-3 py-1 text-white rounded"
                >
                  Ver Detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de detalhes */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              Detalhes da Solicitação #{selectedRequest.id}
            </h3>
            <p><strong>Serviço:</strong> {selectedRequest.servico}</p>
            <p><strong>Data:</strong> {selectedRequest.data}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <p><strong>Valor:</strong> R$ {selectedRequest.valor}</p>
            <p><strong>Descrição:</strong> {selectedRequest.descricao}</p>

            {selectedRequest.status === "Pendente" && (
              <button
                onClick={() => cancelRequest(selectedRequest.id)}
                style={{ backgroundColor: theme.secondaryColor }}
                className="mt-4 px-4 py-2 text-white rounded"
              >
                Cancelar Solicitação
              </button>
            )}

            <button
              onClick={() => setSelectedRequest(null)}
              className="mt-4 ml-2 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================
// ADMIN - USUÁRIOS
// =============================
const AdminUsers = ({ users, setUsers }) => {
  const [editingUser, setEditingUser] = React.useState(null);
  const [newUser, setNewUser] = React.useState({ nome: "", email: "", tipo: "cliente" });

  const saveUser = () => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
    } else {
      if (!newUser.nome || !newUser.email) {
        alert("Preencha todos os campos!");
        return;
      }
      setUsers(prev => [...prev, { ...newUser, id: Date.now() }]);
      setNewUser({ nome: "", email: "", tipo: "cliente" });
    }
  };

  const deleteUser = (id) => {
    if (confirm("Confirma exclusão?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">👥 Gerenciar Usuários</h2>
      
      {/* Formulário */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-bold mb-4">
          {editingUser ? "Editar Usuário" : "Novo Usuário"}
        </h3>
        <input
          type="text"
          placeholder="Nome"
          value={editingUser ? editingUser.nome : newUser.nome}
          onChange={(e) => editingUser 
            ? setEditingUser({...editingUser, nome: e.target.value})
            : setNewUser({...newUser, nome: e.target.value})
          }
          className="border px-2 py-1 mr-2 mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={editingUser ? editingUser.email : newUser.email}
          onChange={(e) => editingUser 
            ? setEditingUser({...editingUser, email: e.target.value})
            : setNewUser({...newUser, email: e.target.value})
          }
          className="border px-2 py-1 mr-2 mb-2"
        />
        <select
          value={editingUser ? editingUser.tipo : newUser.tipo}
          onChange={(e) => editingUser 
            ? setEditingUser({...editingUser, tipo: e.target.value})
            : setNewUser({...newUser, tipo: e.target.value})
          }
          className="border px-2 py-1 mr-2 mb-2"
        >
          <option value="cliente">Cliente</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={saveUser}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingUser ? "Atualizar" : "Criar"}
        </button>
        {editingUser && (
          <button
            onClick={() => setEditingUser(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Tabela */}
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b">
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.tipo}</td>
              <td>
                <button
                  onClick={() => setEditingUser(user)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// =============================
// ADMIN - PRODUTOS
// =============================
const AdminProducts = ({ products, setProducts }) => {
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [newProduct, setNewProduct] = React.useState({ nome: "", preco: "", categoria: "" });

  const saveProduct = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
    } else {
      if (!newProduct.nome || !newProduct.preco || !newProduct.categoria) {
        alert("Preencha todos os campos!");
        return;
      }
      setProducts(prev => [...prev, { 
        ...newProduct, 
        id: Date.now(), 
        preco: parseFloat(newProduct.preco) 
      }]);
      setNewProduct({ nome: "", preco: "", categoria: "" });
    }
  };

  const deleteProduct = (id) => {
    if (confirm("Confirma exclusão?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">📦 Gerenciar Produtos</h2>
      
      {/* Formulário */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-bold mb-4">
          {editingProduct ? "Editar Produto" : "Novo Produto"}
        </h3>
        <input
          type="text"
          placeholder="Nome"
          value={editingProduct ? editingProduct.nome : newProduct.nome}
          onChange={(e) => editingProduct 
            ? setEditingProduct({...editingProduct, nome: e.target.value})
            : setNewProduct({...newProduct, nome: e.target.value})
          }
          className="border px-2 py-1 mr-2 mb-2"
        />
        <input
          type="number"
          placeholder="Preço"
          value={editingProduct ? editingProduct.preco : newProduct.preco}
          onChange={(e) => editingProduct 
            ? setEditingProduct({...editingProduct, preco: parseFloat(e.target.value)})
            : setNewProduct({...newProduct, preco: e.target.value})
          }
          className="border px-2 py-1 mr-2 mb-2"
        />
        <input
          type="text"
          placeholder="Categoria"
          value={editingProduct ? editingProduct.categoria : newProduct.categoria}
          onChange={(e) => editingProduct 
            ? setEditingProduct({...editingProduct, categoria: e.target.value})
            : setNewProduct({...newProduct, categoria: e.target.value})
          }
          className="border px-2 py-1 mr-2 mb-2"
        />
        <button
          onClick={saveProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingProduct ? "Atualizar" : "Criar"}
        </button>
        {editingProduct && (
          <button
            onClick={() => setEditingProduct(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Tabela */}
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b">
              <td>{product.id}</td>
              <td>{product.nome}</td>
              <td>R$ {product.preco}</td>
              <td>{product.categoria}</td>
              <td>
                <button
                  onClick={() => setEditingProduct(product)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// =============================
// ADMIN - PEDIDOS
// =============================
const AdminOrders = ({ orders, setOrders }) => {
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const atualizarStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: status } : order
      )
    );
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">📋 Gerenciar Pedidos</h2>
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Total</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b">
              <td>{o.id}</td>
              <td>{o.cliente}</td>
              <td>{o.data}</td>
              <td>R$ {o.total}</td>
              <td>{o.status}</td>
              <td>
                <button
                  onClick={() => setSelectedOrder(o)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Ver Detalhes
                </button>
                {o.status === "Pendente" && (
                  <div className="inline-flex gap-1">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => atualizarStatus(o.id, "Aceito")}
                    >
                      Aceitar
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => atualizarStatus(o.id, "Rejeitado")}
                    >
                      Rejeitar
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de detalhes */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              Detalhes do Pedido #{selectedOrder.id}
            </h3>
            <p><strong>Cliente:</strong> {selectedOrder.cliente}</p>
            <p><strong>Data:</strong> {selectedOrder.data}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <h4 className="font-bold mt-4 mb-2">Produtos:</h4>
            <ul className="mb-4">
              {selectedOrder.produtos.map((p, idx) => (
                <li key={idx}>• {p.nome} - R$ {p.preco}</li>
              ))}
            </ul>
            <p className="font-semibold">💰 Total: R$ {selectedOrder.total}</p>
            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================
// ADMIN - SERVIÇOS
// =============================
const AdminServices = ({ services, setServices }) => {
  const [editingService, setEditingService] = React.useState(null);
  const [newService, setNewService] = React.useState({ nome: "", descricao: "", valor: "" });

  const saveService = () => {
    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
      setEditingService(null);
    } else {
      if (!newService.nome || !newService.descricao || !newService.valor) {
        alert("Preencha todos os campos!");
        return;
      }
      setServices(prev => [...prev, { 
        ...newService, 
        id: Date.now(), 
        valor: parseFloat(newService.valor) 
      }]);
      setNewService({ nome: "", descricao: "", valor: "" });
    }
  };

  const deleteService = (id) => {
    if (confirm("Confirma exclusão?")) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">🛠️ Gerenciar Serviços</h2>
      
      {/* Formulário */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-bold mb-4">
          {editingService ? "Editar Serviço" : "Novo Serviço"}
        </h3>
        <input
          type="text"
          placeholder="Nome"
          value={editingService ? editingService.nome : newService.nome}
          onChange={(e) => editingService 
            ? setEditingService({...editingService, nome: e.target.value})
            : setNewService({...newService, nome: e.target.value})
          }
          className="border px-2 py-1 mr-2 mb-2"
        />
        <input
          type="text"
          placeholder="Descrição"
          value={editingService ? editingService.descricao : newService.descricao}
          onChange={(e) => editingService 
            ? setEditingService({...editingService, descricao: e.target.value})
            : setNewService({...newService, descricao: e.target.value})
          }
          className="border px-2 py-1 mr-2 mb-2"
        />
        <input
          type="number"
          placeholder="Valor"
          value={editingService ? editingService.valor : newService.valor}
          onChange={(e) => editingService 
            ? setEditingService({...editingService, valor: parseFloat(e.target.value)})
            : setNewService({...newService, valor: e.target.value})
          }
          className="border px-2 py-1 mr-2 mb-2"
        />
        <button
          onClick={saveService}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingService ? "Atualizar" : "Criar"}
        </button>
        {editingService && (
          <button
            onClick={() => setEditingService(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Tabela */}
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id} className="border-b">
              <td>{service.id}</td>
              <td>{service.nome}</td>
              <td>{service.descricao}</td>
              <td>R$ {service.valor}</td>
              <td>
                <button
                  onClick={() => setEditingService(service)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// =============================
// ADMIN - SOLICITAÇÕES
// =============================
const AdminRequests = ({ serviceRequests, setServiceRequests }) => {
  const [selectedRequest, setSelectedRequest] = React.useState(null);

  const updateRequestStatus = (id, status) => {
    setServiceRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status } : req)
    );
    setSelectedRequest(null);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">📝 Gerenciar Solicitações de Serviço</h2>
      
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Data</th>
            <th>Status</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {serviceRequests.map(request => (
            <tr key={request.id} className="border-b">
              <td>{request.id}</td>
              <td>{request.cliente}</td>
              <td>{request.servico}</td>
              <td>{request.data}</td>
              <td>{request.status}</td>
              <td>R$ {request.valor}</td>
              <td>
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Ver Detalhes
                </button>
                {request.status === "Pendente" && (
                  <div className="inline-flex gap-1">
                    <button
                      onClick={() => updateRequestStatus(request.id, "Aceito")}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Aceitar
                    </button>
                    <button
                      onClick={() => updateRequestStatus(request.id, "Rejeitado")}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Rejeitar
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de detalhes */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              Detalhes da Solicitação #{selectedRequest.id}
            </h3>
            <p><strong>Cliente:</strong> {selectedRequest.cliente}</p>
            <p><strong>Serviço:</strong> {selectedRequest.servico}</p>
            <p><strong>Data:</strong> {selectedRequest.data}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <p><strong>Valor:</strong> R$ {selectedRequest.valor}</p>
            <p><strong>Descrição:</strong> {selectedRequest.descricao}</p>
            
            {selectedRequest.status === "Pendente" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => updateRequestStatus(selectedRequest.id, "Aceito")}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Aceitar
                </button>
                <button
                  onClick={() => updateRequestStatus(selectedRequest.id, "Rejeitado")}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Rejeitar
                </button>
              </div>
            )}
            
            <button
              onClick={() => setSelectedRequest(null)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================
// ADMIN - CONFIGURAÇÕES
// =============================
const AdminConfig = ({ systemConfig, setSystemConfig }) => {
  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setSystemConfig((prev) => ({ ...prev, [type]: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">⚙️ Configurações do Sistema</h2>

      <div className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block font-bold mb-2">Nome do sistema:</label>
          <input
            type="text"
            value={systemConfig.name}
            onChange={(e) =>
              setSystemConfig({ ...systemConfig, name: e.target.value })
            }
            className="border px-3 py-2 w-full rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Cor primária:</label>
          <input
            type="color"
            value={systemConfig.primaryColor}
            onChange={(e) =>
              setSystemConfig({ ...systemConfig, primaryColor: e.target.value })
            }
            className="border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Cor secundária:</label>
          <input
            type="color"
            value={systemConfig.secondaryColor}
            onChange={(e) =>
              setSystemConfig({ ...systemConfig, secondaryColor: e.target.value })
            }
            className="border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Upload Logo (Header):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e, "logo")}
            className="border px-3 py-2 w-full rounded"
          />
          {systemConfig.logo && (
            <img src={systemConfig.logo} alt="Preview" className="mt-2 h-16" />
          )}
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">Upload Favicon:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e, "favicon")}
            className="border px-3 py-2 w-full rounded"
          />
          {systemConfig.favicon && (
            <img src={systemConfig.favicon} alt="Preview" className="mt-2 h-8" />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;