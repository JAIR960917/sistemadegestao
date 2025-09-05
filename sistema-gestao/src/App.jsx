import React from "react";
import jsPDF from "jspdf";

export default function App() {
  // Tela atual: 'login' | 'admin' | 'client'
  const [currentView, setCurrentView] = React.useState("login");
  const [currentUser, setCurrentUser] = React.useState(null);

  // Persistir aba ativa do Admin entre re-renders/navegações
  const [adminActiveTab, setAdminActiveTab] = React.useState("users");

  // Dados principais
  const [users, setUsers] = React.useState([
    { id: 1, username: "admin", password: "admin123", name: "Administrador", email: "admin@empresa.com", role: "admin" },
    { id: 2, username: "cliente", password: "cliente123", name: "Cliente Demo", email: "cliente@exemplo.com", role: "client" },
  ]);

  const [products, setProducts] = React.useState([
    { id: 101, name: "Notebook Pro", price: 5200.0, stock: 5, description: "Notebook potente para trabalho e estudos." },
    { id: 102, name: "Mouse Gamer", price: 150.0, stock: 20, description: "Mouse com alta precisão e RGB." },
    { id: 103, name: "Teclado Mecânico", price: 350.5, stock: 12, description: "Switches mecânicos e iluminação." },
  ]);

  // Serviços
  const [services, setServices] = React.useState([
    { id: 201, title: "Instalação de Software", description: "Instalação e configuração básica de aplicativos.", price: 120.0, duration: "1h" },
    { id: 202, title: "Formatação Completa", description: "Backup, formatação e reinstalação do sistema.", price: 350.0, duration: "3h" },
  ]);

  const [orders, setOrders] = React.useState([]);
  const [reports, setReports] = React.useState([]);

  // Solicitações de serviços (cliente solicita, admin aceita/recusa)
  const [serviceRequests, setServiceRequests] = React.useState([]);

  // Carrinho do cliente
  const [cart, setCart] = React.useState([]);

  // -------------------- LOGIN --------------------
  const LoginScreen = () => {
    const [form, setForm] = React.useState({ username: "", password: "" });
    const [error, setError] = React.useState("");

    const handleLogin = (e) => {
      e.preventDefault();
      const found = users.find(
        (u) => u.username === form.username && u.password === form.password
      );
      if (!found) {
        setError("Usuário ou senha inválidos.");
        return;
      }
      setCurrentUser(found);
      setCurrentView(found.role === "admin" ? "admin" : "client");
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-1 text-center">Acesso ao Sistema</h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Entre como administrador ou cliente
          </p>
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded p-2 mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Usuário</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="admin ou cliente"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="admin123 ou cliente123"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  };

  // -------------------- ADMIN --------------------
  const AdminDashboard = ({ adminActiveTab, setAdminActiveTab }) => {
    const activeTab = adminActiveTab;
    const setActiveTab = setAdminActiveTab;

    // Criação de usuário
    const [newUser, setNewUser] = React.useState({
      username: "",
      password: "",
      name: "",
      email: "",
      role: "client",
    });

    // Criação/Edição de produto
    const [newProduct, setNewProduct] = React.useState({
      name: "",
      price: "",
      stock: "",
      description: "",
    });
    const [editingProduct, setEditingProduct] = React.useState(null);

    // Criação/Edição de serviço
    const [newService, setNewService] = React.useState({
      title: "",
      description: "",
      price: "",
      duration: "",
    });
    const [editingService, setEditingService] = React.useState(null);

    // Modal de detalhes do pedido
    const [orderModalOpen, setOrderModalOpen] = React.useState(false);
    const [orderViewing, setOrderViewing] = React.useState(null);

    // Modal de detalhes da solicitação
    const [requestModalOpen, setRequestModalOpen] = React.useState(false);
    const [requestViewing, setRequestViewing] = React.useState(null);
    const [scheduledDate, setScheduledDate] = React.useState("");

    const openOrderModal = (order) => {
      setOrderViewing(order);
      setOrderModalOpen(true);
    };
    const closeOrderModal = () => {
      setOrderModalOpen(false);
      setOrderViewing(null);
    };

    const openRequestModal = (req) => {
      setRequestViewing(req);
      // Preenche com a data já agendada (se existir) ou agora, no formato esperado por datetime-local
      const initial = req?.scheduledAt
        ? req.scheduledAt
        : new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16); // +1h
      setScheduledDate(initial);
      setRequestModalOpen(true);
    };

    const closeRequestModal = () => {
      setRequestModalOpen(false);
      setRequestViewing(null);
      setScheduledDate("");
    };

    // Modal genérico reutilizável
    const Modal = ({ open, onClose, title, children, footer }) => {
      if (!open) return null;
      return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={onClose}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Fechar modal"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-auto">{children}</div>
            {footer && <div className="p-4 border-t">{footer}</div>}
          </div>
        </div>
      );
    };

    const handleCreateUser = (e) => {
      e.preventDefault();
      const user = { ...newUser, id: Date.now() };
      setUsers((prev) => [...prev, user]);
      setNewUser({
        username: "",
        password: "",
        name: "",
        email: "",
        role: "client",
      });
      // Permanece na aba atual (estado persistido no App)
    };

    const handleDeleteUser = (id) => {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    };

    const handleDeleteProduct = (id) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const handleDeleteService = (id) => {
      setServices((prev) => prev.filter((s) => s.id !== id));
    };

    // helper para quebra de página no PDF
    const addPageIfNeeded = (doc, y) => {
      if (y > 275) {
        doc.addPage();
        return 20;
      }
      return y;
    };

    // Geração de Relatório + PDF
    const generateReport = () => {
      const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => o.status === "pending").length;
      const completedOrders = orders.filter((o) => o.status === "completed").length;

      const report = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        totalSales,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalProducts: products.length,
        totalUsers: users.filter((u) => u.role === "client").length,
      };

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Relatório do Sistema", 20, 20);
      doc.setFontSize(11);

      // Resumo
      let y = 35;
      [
        `Data do relatório: ${report.date}`,
        `Total de Vendas: R$ ${report.totalSales.toFixed(2)}`,
        `Total de Pedidos: ${report.totalOrders} (Concluídos: ${report.completedOrders} | Pendentes: ${report.pendingOrders})`,
        `Total de Produtos: ${report.totalProducts}`,
        `Total de Clientes: ${report.totalUsers}`,
      ].forEach((t) => {
        doc.text(t, 20, y);
        y += 7;
      });

      // Vendas detalhadas
      y += 5;
      y = addPageIfNeeded(doc, y);
      doc.setFontSize(13);
      doc.text("Vendas detalhadas", 20, y);
      doc.setFontSize(10);
      y += 8;

      if (orders.length === 0) {
        y = addPageIfNeeded(doc, y);
        doc.text("Nenhuma venda registrada.", 20, y);
        y += 8;
      } else {
        orders.forEach((order, oi) => {
          const client = users.find((u) => u.id === order.clientId);
          y = addPageIfNeeded(doc, y);
          doc.setFontSize(11);
          doc.text(
            `Pedido #${order.id} | Data: ${order.date} | Cliente: ${client?.name ?? "N/A"} | Status: ${order.status === "completed" ? "Concluído" : "Pendente"}`,
            20,
            y
          );
          y += 6;

          // Cabeçalho dos itens
          y = addPageIfNeeded(doc, y);
          doc.setFontSize(10);
          doc.text("Produto", 22, y);
          doc.text("Qtd", 120, y);
          doc.text("Unitário", 140, y);
          doc.text("Subtotal", 170, y);
          y += 5;

          // Itens
          order.items.forEach((it) => {
            const prod = products.find((p) => p.id === it.productId);
            const unit = prod?.price ?? 0;
            const subtotal = unit * it.qty;

            y = addPageIfNeeded(doc, y);
            const name = (prod?.name ?? "Produto").toString();
            const trimmed = name.length > 60 ? name.substring(0, 57) + "..." : name;

            doc.text(trimmed, 22, y);
            doc.text(String(it.qty), 120, y, { align: "left" });
            doc.text(`R$ ${unit.toFixed(2)}`, 140, y, { align: "left" });
            doc.text(`R$ ${subtotal.toFixed(2)}`, 170, y, { align: "left" });
            y += 5;
          });

          y = addPageIfNeeded(doc, y);
          doc.setFontSize(10);
          doc.text(`Total do pedido: R$ ${order.total.toFixed(2)}`, 22, y);
          y += 8;

          if (oi < orders.length - 1) {
            y = addPageIfNeeded(doc, y);
            doc.setDrawColor(200, 200, 200);
            doc.line(20, y, 190, y);
            y += 6;
          }
        });
      }

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Salva o relatório com link para download
      setReports((prev) => [{ ...report, pdfUrl }, ...prev ]);
    };

    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Painel Administrativo</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm">Bem-vindo, {currentUser?.name}</span>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentView("login");
                }}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Sair
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto lg:flex">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 bg-white shadow-md">
            <div className="p-4">
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full text-left p-2 rounded mb-2 ${activeTab === "users" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
              >
                Gerenciar Usuários
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`w-full text-left p-2 rounded mb-2 ${activeTab === "products" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
              >
                Gerenciar Produtos
              </button>
              <button
                onClick={() => setActiveTab("services")}
                className={`w-full text-left p-2 rounded mb-2 ${activeTab === "services" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
              >
                Gerenciar Serviços
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`w-full text-left p-2 rounded mb-2 ${activeTab === "requests" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
              >
                Solicitações
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full text-left p-2 rounded mb-2 ${activeTab === "orders" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
              >
                Pedidos
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`w-full text-left p-2 rounded mb-2 ${activeTab === "reports" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
              >
                Relatórios
              </button>
            </div>
          </aside>

          {/* Conteúdo */}
          <main className="flex-1 p-6">
            {activeTab === "users" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Gerenciar Usuários</h2>

                <div className="bg-white p-4 rounded-lg shadow mb-6">
                  <h3 className="text-lg font-semibold mb-3">Criar Novo Usuário</h3>
                  <form onSubmit={handleCreateUser} className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nome de usuário"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      className="px-3 py-2 border rounded"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Senha"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="px-3 py-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Nome completo"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="px-3 py-2 border rounded"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="px-3 py-2 border rounded"
                      required
                    />
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="px-3 py-2 border rounded"
                    >
                      <option value="client">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Criar Usuário
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Nome</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Tipo</th>
                        <th className="px-4 py-2 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="px-4 py-2">{user.id}</td>
                          <td className="px-4 py-2">{user.name}</td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-sm ${user.role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
                              {user.role === "admin" ? "Admin" : "Cliente"}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                              disabled={user.id === currentUser?.id}
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
            )}

            {activeTab === "products" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Gerenciar Produtos</h2>

                <div className="bg-white p-4 rounded-lg shadow mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    {editingProduct ? "Editar Produto" : "Criar Novo Produto"}
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editingProduct) {
                        const normalized = { ...editingProduct, price: parseFloat(editingProduct.price), stock: parseInt(editingProduct.stock) };
                        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? normalized : p)));
                        setEditingProduct(null);
                      } else {
                        const product = { ...newProduct, id: Date.now(), price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) };
                        setProducts((prev) => [...prev, product]);
                        setNewProduct({ name: "", price: "", stock: "", description: "" });
                      }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <input
                      type="text"
                      placeholder="Nome do produto"
                      value={editingProduct ? editingProduct.name : newProduct.name}
                      onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value }))}
                      className="px-3 py-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Preço"
                      value={editingProduct ? editingProduct.price : newProduct.price}
                      onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, price: e.target.value }) : setNewProduct({ ...newProduct, price: e.target.value }))}
                      className="px-3 py-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Estoque"
                      value={editingProduct ? editingProduct.stock : newProduct.stock}
                      onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, stock: e.target.value }) : setNewProduct({ ...newProduct, stock: e.target.value }))}
                      className="px-3 py-2 border rounded"
                      required
                    />
                    <textarea
                      placeholder="Descrição"
                      value={editingProduct ? editingProduct.description : newProduct.description}
                      onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, description: e.target.value }) : setNewProduct({ ...newProduct, description: e.target.value }))}
                      className="px-3 py-2 border rounded md:col-span-2"
                      required
                    />
                    <div className="flex gap-3 md:col-span-2">
                      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        {editingProduct ? "Salvar Alterações" : "Criar Produto"}
                      </button>
                      {editingProduct && (
                        <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Nome</th>
                        <th className="px-4 py-2 text-left">Preço</th>
                        <th className="px-4 py-2 text-left">Estoque</th>
                        <th className="px-4 py-2 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-t">
                          <td className="px-4 py-2">{product.id}</td>
                          <td className="px-4 py-2">{product.name}</td>
                          <td className="px-4 py-2">R$ {parseFloat(product.price).toFixed(2)}</td>
                          <td className="px-4 py-2">{product.stock}</td>
                          <td className="px-4 py-2 space-x-2">
                            <button onClick={() => setEditingProduct(product)} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600">
                              Editar
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600">
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Gerenciar Serviços</h2>

                <div className="bg-white p-4 rounded-lg shadow mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    {editingService ? "Editar Serviço" : "Criar Novo Serviço"}
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editingService) {
                        const normalized = {
                          ...editingService,
                          price: parseFloat(editingService.price),
                        };
                        setServices((prev) => prev.map((s) => (s.id === editingService.id ? normalized : s)));
                        setEditingService(null);
                      } else {
                        const service = {
                          ...newService,
                          id: Date.now(),
                          price: parseFloat(newService.price),
                        };
                        setServices((prev) => [...prev, service]);
                        setNewService({ title: "", description: "", price: "", duration: "" });
                      }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <input
                      type="text"
                      placeholder="Título do serviço"
                      value={editingService ? editingService.title : newService.title}
                      onChange={(e) =>
                        editingService
                          ? setEditingService({ ...editingService, title: e.target.value })
                          : setNewService({ ...newService, title: e.target.value })
                      }
                      className="px-3 py-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Duração (ex: 1h, 3 dias)"
                      value={editingService ? editingService.duration : newService.duration}
                      onChange={(e) =>
                        editingService
                          ? setEditingService({ ...editingService, duration: e.target.value })
                          : setNewService({ ...newService, duration: e.target.value })
                      }
                      className="px-3 py-2 border rounded"
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Preço"
                      value={editingService ? editingService.price : newService.price}
                      onChange={(e) =>
                        editingService
                          ? setEditingService({ ...editingService, price: e.target.value })
                          : setNewService({ ...newService, price: e.target.value })
                      }
                      className="px-3 py-2 border rounded"
                      required
                    />
                    <textarea
                      placeholder="Descrição"
                      value={editingService ? editingService.description : newService.description}
                      onChange={(e) =>
                        editingService
                          ? setEditingService({ ...editingService, description: e.target.value })
                          : setNewService({ ...newService, description: e.target.value })
                      }
                      className="px-3 py-2 border rounded md:col-span-2"
                      required
                    />
                    <div className="flex gap-3 md:col-span-2">
                      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        {editingService ? "Salvar Alterações" : "Criar Serviço"}
                      </button>
                      {editingService && (
                        <button type="button" onClick={() => setEditingService(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Título</th>
                        <th className="px-4 py-2 text-left">Preço</th>
                        <th className="px-4 py-2 text-left">Duração</th>
                        <th className="px-4 py-2 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s) => (
                        <tr key={s.id} className="border-t">
                          <td className="px-4 py-2">{s.id}</td>
                          <td className="px-4 py-2">{s.title}</td>
                          <td className="px-4 py-2">R$ {parseFloat(s.price).toFixed(2)}</td>
                          <td className="px-4 py-2">{s.duration}</td>
                          <td className="px-4 py-2 space-x-2">
                            <button onClick={() => setEditingService(s)} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600">
                              Editar
                            </button>
                            <button onClick={() => handleDeleteService(s.id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600">
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "requests" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Solicitações de Serviços</h2>
                <div className="bg-white rounded-lg shadow">
                  {serviceRequests.length === 0 ? (
                    <p className="p-4 text-gray-600">Nenhuma solicitação até o momento.</p>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">ID</th>
                          <th className="px-4 py-2 text-left">Cliente</th>
                          <th className="px-4 py-2 text-left">Serviço</th>
                          <th className="px-4 py-2 text-left">Data</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Agendado para</th>
                          <th className="px-4 py-2 text-left">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceRequests.map((req) => {
                          const client = users.find((u) => u.id === req.clientId);
                          const service = services.find((s) => s.id === req.serviceId);
                          return (
                            <tr key={req.id} className="border-t">
                              <td className="px-4 py-2">{req.id}</td>
                              <td className="px-4 py-2">{client?.name}</td>
                              <td className="px-4 py-2">{service?.title}</td>
                              <td className="px-4 py-2">{req.date}</td>
                              <td className="px-4 py-2">
                                {req.status === "pending" ? (
                                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                                    Pendente
                                  </span>
                                ) : req.status === "accepted" ? (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                    Aceito
                                  </span>
                                ) : req.status === "rejected" ? (
                                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                    Recusado
                                  </span>
                                ) : (
                                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                                    Cancelado
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2">
                                {req.scheduledAt ? (
                                  <span className="text-sm text-gray-700">{req.scheduledAt.replace("T", " ")}</span>
                                ) : (
                                  <span className="text-sm text-gray-400 italic">—</span>
                                )}
                              </td>
                              <td className="px-4 py-2 space-x-2">
                                <button
                                  onClick={() => openRequestModal(req)}
                                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 mr-2"
                                >
                                  Ver Detalhes
                                </button>
                                {req.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        setServiceRequests((prev) =>
                                          prev.map((r) =>
                                            r.id === req.id ? { ...r, status: "accepted" } : r
                                          )
                                        )
                                      }
                                      className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                                    >
                                      Aceitar
                                    </button>
                                    <button
                                      onClick={() =>
                                        setServiceRequests((prev) =>
                                          prev.map((r) =>
                                            r.id === req.id ? { ...r, status: "rejected" } : r
                                          )
                                        )
                                      }
                                      className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                    >
                                      Recusar
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Modal de detalhes da solicitação */}
                <Modal
                  open={requestModalOpen}
                  onClose={closeRequestModal}
                  title={
                    requestViewing
                      ? `Solicitação #${requestViewing.id}`
                      : "Detalhes da Solicitação"
                  }
                  footer={
                    <div className="flex justify-end gap-2">
                      {requestViewing?.status === "pending" && (
                        <>
                          <button
                            onClick={() => {
                              if (!scheduledDate) {
                                alert("Defina uma data e hora para o agendamento.");
                                return;
                              }
                              setServiceRequests((prev) =>
                                prev.map((r) =>
                                  r.id === requestViewing.id
                                    ? { ...r, status: "accepted", scheduledAt: scheduledDate }
                                    : r
                                )
                              );
                              closeRequestModal();
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            Aceitar (agendar)
                          </button>
                          <button
                            onClick={() => {
                              setServiceRequests((prev) =>
                                prev.map((r) =>
                                  r.id === requestViewing.id ? { ...r, status: "rejected" } : r
                                )
                              );
                              closeRequestModal();
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                          >
                            Recusar
                          </button>
                        </>
                      )}

                      {requestViewing?.status === "accepted" && (
                        <button
                          onClick={() => {
                            if (!scheduledDate) {
                              alert("Defina uma data e hora para o reagendamento.");
                              return;
                            }
                            setServiceRequests((prev) =>
                              prev.map((r) =>
                                r.id === requestViewing.id ? { ...r, scheduledAt: scheduledDate } : r
                              )
                            );
                            closeRequestModal();
                          }}
                          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                          Salvar reagendamento
                        </button>
                      )}

                      <button
                        onClick={closeRequestModal}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                      >
                        Fechar
                      </button>
                    </div>
                  }
                >
                  {requestViewing ? (
                    (() => {
                      const client = users.find((u) => u.id === requestViewing.clientId);
                      const service = services.find((s) => s.id === requestViewing.serviceId);
                      return (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-gray-500">Cliente</div>
                              <div className="font-medium">{client?.name ?? "N/A"}</div>
                              <div className="text-gray-500 mt-1">Email</div>
                              <div className="font-medium">{client?.email ?? "N/A"}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Data</div>
                              <div className="font-medium">{requestViewing.date}</div>
                              <div className="text-gray-500 mt-1">Status</div>
                              <div>
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    requestViewing.status === "accepted"
                                      ? "bg-green-100 text-green-700"
                                      : requestViewing.status === "rejected"
                                      ? "bg-red-100 text-red-700"
                                      : requestViewing.status === "cancelled"
                                      ? "bg-gray-200 text-gray-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {requestViewing.status === "accepted"
                                    ? "Aceito"
                                    : requestViewing.status === "rejected"
                                    ? "Recusado"
                                    : requestViewing.status === "cancelled"
                                    ? "Cancelado"
                                    : "Pendente"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="border rounded">
                            <div className="bg-gray-50 px-3 py-2 text-sm font-semibold">
                              Serviço
                            </div>
                            <div className="px-3 py-3 text-sm">
                              <div className="font-medium">{service?.title ?? "Serviço"}</div>
                              <div className="text-gray-600 mt-1">
                                {service?.description ?? "—"}
                              </div>
                              <div className="flex items-center gap-6 mt-3">
                                <div>
                                  <div className="text-gray-500">Preço</div>
                                  <div className="font-semibold">
                                    R$ {service ? parseFloat(service.price).toFixed(2) : "0,00"}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Duração</div>
                                  <div className="font-semibold">
                                    {service?.duration ?? "—"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Agendamento */}
                          <div className="border rounded">
                            <div className="bg-gray-50 px-3 py-2 text-sm font-semibold">Agendamento</div>
                            <div className="px-3 py-3 text-sm space-y-2">
                              <label className="block text-gray-600 text-sm">Data e hora</label>
                              <input
                                type="datetime-local"
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                className="border rounded px-3 py-2"
                              />
                              {requestViewing?.scheduledAt && (
                                <p className="text-xs text-gray-500">
                                  Agendado atualmente para: {requestViewing.scheduledAt.replace("T", " ")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <p>Carregando...</p>
                  )}
                </Modal>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Gerenciar Pedidos</h2>
                <div className="bg-white rounded-lg shadow">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Cliente</th>
                        <th className="px-4 py-2 text-left">Total</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Data</th>
                        <th className="px-4 py-2 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const client = users.find((u) => u.id === order.clientId);
                        return (
                          <tr key={order.id} className="border-t">
                            <td className="px-4 py-2">{order.id}</td>
                            <td className="px-4 py-2">{client?.name}</td>
                            <td className="px-4 py-2">R$ {order.total.toFixed(2)}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded text-sm ${order.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                {order.status === "completed" ? "Concluído" : "Pendente"}
                              </span>
                            </td>
                            <td className="px-4 py-2">{order.date}</td>
                            <td className="px-4 py-2 space-x-2">
                              <button
                                onClick={() => openOrderModal(order)}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                              >
                                Ver Detalhes
                              </button>

                              {order.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      setOrders((prev) =>
                                        prev.map((o) =>
                                          o.id === order.id ? { ...o, status: "completed" } : o
                                        )
                                      )
                                    }
                                    className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                                  >
                                    Concluir
                                  </button>
                                  <button
                                    onClick={() =>
                                      setOrders((prev) => prev.filter((o) => o.id !== order.id))
                                    }
                                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                  >
                                    Recusar
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Modal de detalhes do pedido */}
                <Modal
                  open={orderModalOpen}
                  onClose={closeOrderModal}
                  title={
                    orderViewing
                      ? `Pedido #${orderViewing.id} — ${users.find(u => u.id === orderViewing.clientId)?.name ?? "Cliente"}`
                      : "Detalhes do Pedido"
                  }
                  footer={
                    <div className="flex justify-end gap-2">
                      {orderViewing?.status === "pending" && (
                        <>
                          <button
                            onClick={() => {
                              setOrders((prev) =>
                                prev.map((o) =>
                                  o.id === orderViewing.id ? { ...o, status: "completed" } : o
                                )
                              );
                              closeOrderModal();
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            Concluir
                          </button>
                          <button
                            onClick={() => {
                              setOrders((prev) => prev.filter((o) => o.id !== orderViewing.id));
                              closeOrderModal();
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                          >
                            Recusar
                          </button>
                        </>
                      )}
                      <button
                        onClick={closeOrderModal}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                      >
                        Fechar
                      </button>
                    </div>
                  }
                >
                  {orderViewing ? (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        Data: {orderViewing.date} • Status:{" "}
                        <span className={`px-2 py-1 rounded text-xs ${orderViewing.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {orderViewing.status === "completed" ? "Concluído" : "Pendente"}
                        </span>
                      </div>
                      <div className="border rounded">
                        <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 text-sm font-semibold">
                          <div className="col-span-6">Produto</div>
                          <div className="col-span-2 text-right">Qtd</div>
                          <div className="col-span-2 text-right">Unitário</div>
                          <div className="col-span-2 text-right">Subtotal</div>
                        </div>
                        <div>
                          {orderViewing.items.map((it, idx) => {
                            const prod = products.find((p) => p.id === it.productId);
                            const unit = prod?.price ?? 0;
                            const subtotal = unit * it.qty;
                            return (
                              <div key={idx} className="grid grid-cols-12 px-3 py-2 border-t text-sm">
                                <div className="col-span-6">{prod?.name ?? "Produto"}</div>
                                <div className="col-span-2 text-right">{it.qty}</div>
                                <div className="col-span-2 text-right">R$ {unit.toFixed(2)}</div>
                                <div className="col-span-2 text-right">R$ {subtotal.toFixed(2)}</div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-end px-3 py-2 border-t font-semibold">
                          Total: R$ {orderViewing.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>Carregando...</p>
                  )}
                </Modal>
              </div>
            )}

            {activeTab === "reports" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Relatórios</h2>
                <div className="mb-6 flex gap-3">
                  <button onClick={generateReport} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Gerar Relatório
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Total de Vendas</h3>
                    <p className="text-2xl font-bold text-green-600">R$ {orders.reduce((s, o) => s + o.total, 0).toFixed(2)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Total de Pedidos</h3>
                    <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Produtos</h3>
                    <p className="text-2xl font-bold text-purple-600">{products.length}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">Clientes</h3>
                    <p className="text-2xl font-bold text-orange-600">{users.filter((u) => u.role === "client").length}</p>
                  </div>
                </div>

                {reports.length > 0 && (
                  <div className="bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold p-4 border-b">Histórico de Relatórios</h3>
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Data</th>
                          <th className="px-4 py-2 text-left">Vendas</th>
                          <th className="px-4 py-2 text-left">Pedidos</th>
                          <th className="px-4 py-2 text-left">Pendentes</th>
                          <th className="px-4 py-2 text-left">Concluídos</th>
                          <th className="px-4 py-2 text-left">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((r) => (
                          <tr key={r.id} className="border-t">
                            <td className="px-4 py-2">{r.date}</td>
                            <td className="px-4 py-2">R$ {r.totalSales.toFixed(2)}</td>
                            <td className="px-4 py-2">{r.totalOrders}</td>
                            <td className="px-4 py-2">{r.pendingOrders}</td>
                            <td className="px-4 py-2">{r.completedOrders}</td>
                            <td className="px-4 py-2">
                              {r.pdfUrl ? (
                                <a
                                  href={r.pdfUrl}
                                  download={`relatorio-${r.date}.pdf`}
                                  className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600"
                                >
                                  Baixar PDF
                                </a>
                              ) : (
                                <span className="text-gray-400 text-sm">Sem PDF</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    );
  };

  // -------------------- CLIENTE --------------------
  const ClientDashboard = () => {
    const [search, setSearch] = React.useState("");
    const [activeTab, setActiveTab] = React.useState("shop"); // 'shop' | 'requests'

    const addToCart = (product) => {
      if (product.stock <= 0) return;
      setCart((prev) => {
        const exists = prev.find((i) => i.productId === product.id);
        if (exists) {
          return prev.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + 1 } : i));
        }
        return [...prev, { productId: product.id, qty: 1 }];
      });
    };

    const removeFromCart = (productId) => {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
    };

    const updateQty = (productId, qty) => {
      if (qty <= 0) return removeFromCart(productId);
      setCart((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty } : i)));
    };

    const checkout = () => {
      if (cart.length === 0) return;

      // Verifica estoque
      for (const item of cart) {
        const prod = products.find((p) => p.id === item.productId);
        if (!prod || prod.stock < item.qty) {
          alert(`Estoque insuficiente para ${prod?.name ?? "produto"}.`);
          return;
        }
      }

      // Calcula total
      const total = cart.reduce((sum, item) => {
        const prod = products.find((p) => p.id === item.productId);
        return sum + prod.price * item.qty;
      }, 0);

      // Atualiza estoque
      setProducts((prev) =>
        prev.map((p) => {
          const item = cart.find((i) => i.productId === p.id);
          if (!item) return p;
          return { ...p, stock: p.stock - item.qty };
        })
      );

      // Cria pedido
      const order = {
        id: Date.now(),
        clientId: currentUser.id,
        items: cart,
        total,
        status: "pending",
        date: new Date().toLocaleString(),
      };
      setOrders((prev) => [order, ...prev]);

      // Limpa carrinho
      setCart([]);
      alert("Pedido realizado com sucesso!");
    };

    const requestService = (service) => {
      const request = {
        id: Date.now(),
        clientId: currentUser.id,
        serviceId: service.id,
        status: "pending",
        date: new Date().toLocaleString(),
      };
      setServiceRequests((prev) => [request, ...prev]);
      alert("Solicitação enviada com sucesso!");
    };

    const cancelRequest = (requestId) => {
      setServiceRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "cancelled" } : r))
      );
      alert("Solicitação cancelada.");
    };

    const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    const myOrders = orders.filter((o) => o.clientId === currentUser?.id);
    const myRequests = serviceRequests.filter((r) => r.clientId === currentUser?.id);

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-indigo-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Loja</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm">Olá, {currentUser?.name}</span>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentView("login");
                }}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Sair
              </button>
            </div>
          </div>
        </nav>

        {/* Menu de abas */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto flex">
            <button
              onClick={() => setActiveTab("shop")}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === "shop"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              Loja
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === "requests"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              Minhas Solicitações
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {activeTab === "shop" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Produtos */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {filtered.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl font-bold text-green-600">
                          R$ {product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Estoque: {product.stock}
                        </span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className={`w-full py-2 rounded ${
                          product.stock > 0
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {product.stock > 0 ? "Adicionar ao Carrinho" : "Sem Estoque"}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Serviços */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Serviços Disponíveis</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div key={service.id} className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xl font-bold text-blue-600">
                            R$ {service.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Duração: {service.duration}
                          </span>
                        </div>
                        <button
                          onClick={() => requestService(service)}
                          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                          Solicitar Serviço
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Carrinho e Histórico */}
              <div className="space-y-6">
                {/* Carrinho */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-lg mb-4">Carrinho</h3>
                  {cart.length === 0 ? (
                    <p className="text-gray-500">Carrinho vazio</p>
                  ) : (
                    <>
                      {cart.map((item) => {
                        const product = products.find((p) => p.id === item.productId);
                        return (
                          <div key={item.productId} className="flex justify-between items-center mb-3 pb-3 border-b">
                            <div>
                              <div className="font-medium">{product?.name}</div>
                              <div className="text-sm text-gray-500">
                                R$ {product?.price.toFixed(2)} cada
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQty(item.productId, item.qty - 1)}
                                className="bg-gray-200 px-2 py-1 rounded text-sm"
                              >
                                -
                              </button>
                              <span className="px-2">{item.qty}</span>
                              <button
                                onClick={() => updateQty(item.productId, item.qty + 1)}
                                className="bg-gray-200 px-2 py-1 rounded text-sm"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeFromCart(item.productId)}
                                className="bg-red-500 text-white px-2 py-1 rounded text-sm ml-2"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <div className="mt-4">
                        <div className="font-semibold text-lg mb-3">
                          Total: R${" "}
                          {cart
                            .reduce((sum, item) => {
                              const product = products.find((p) => p.id === item.productId);
                              return sum + product.price * item.qty;
                            }, 0)
                            .toFixed(2)}
                        </div>
                        <button
                          onClick={checkout}
                          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        >
                          Finalizar Compra
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Histórico de Pedidos */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-lg mb-4">Meus Pedidos</h3>
                  {myOrders.length === 0 ? (
                    <p className="text-gray-500">Nenhum pedido ainda</p>
                  ) : (
                    <div className="space-y-3">
                      {myOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="border rounded p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Pedido #{order.id}</span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status === "completed" ? "Concluído" : "Pendente"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.date} • R$ {order.total.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Minhas Solicitações de Serviços</h2>
              {myRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">Você ainda não fez nenhuma solicitação de serviço.</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Serviço</th>
                        <th className="px-4 py-2 text-left">Data</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Agendado para</th>
                        <th className="px-4 py-2 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myRequests.map((req) => {
                        const service = services.find((s) => s.id === req.serviceId);
                        return (
                          <tr key={req.id} className="border-t">
                            <td className="px-4 py-2">{req.id}</td>
                            <td className="px-4 py-2">{service?.title ?? "Serviço"}</td>
                            <td className="px-4 py-2">{req.date}</td>
                            <td className="px-4 py-2">
                              {req.status === "pending" ? (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                                  Pendente
                                </span>
                              ) : req.status === "accepted" ? (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                  Aceito
                                </span>
                              ) : req.status === "rejected" ? (
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                  Recusado
                                </span>
                              ) : (
                                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                                  Cancelado
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              {req.scheduledAt ? (
                                <span className="text-sm text-gray-700">
                                  {req.scheduledAt.replace("T", " ")}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-400 italic">—</span>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              {req.status === "pending" && (
                                <button
                                  onClick={() => cancelRequest(req.id)}
                                  className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                >
                                  Cancelar
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // -------------------- RENDERIZAÇÃO PRINCIPAL --------------------
  return (
    <div>
      {currentView === "login" && <LoginScreen />}
      {currentView === "admin" && (
        <AdminDashboard
          adminActiveTab={adminActiveTab}
          setAdminActiveTab={setAdminActiveTab}
        />
      )}
      {currentView === "client" && <ClientDashboard />}
    </div>
  );
}