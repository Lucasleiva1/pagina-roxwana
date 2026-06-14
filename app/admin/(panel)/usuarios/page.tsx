import { AdminHeader } from "@/components/admin/AdminHeader";
import { createInternalUserAction, getAdminUsers, updateInternalUserRoleAction } from "@/lib/admin/users";

export default async function AdminUsuariosPage() {
  const users = await getAdminUsers();

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Accesos" title="USUARIOS INTERNOS" description="Crear accesos con email/password y autorizar rol editor o admin." />
      <form action={createInternalUserAction} className="grid gap-4 border border-bone/12 bg-charcoal p-5 md:grid-cols-[1fr_1fr_160px_auto]">
        <input name="name" placeholder="Nombre" className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
        <input name="email" type="email" required placeholder="email@roxwana.com" className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
        <select name="role" defaultValue="editor" className="min-h-11 border border-bone/12 bg-ink px-3 text-sm text-bone">
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="min-h-11 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal">
          Crear acceso
        </button>
        <input name="password" type="password" required minLength={6} placeholder="Password inicial" className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold md:col-span-4" />
      </form>

      <div className="overflow-x-auto border border-bone/12 bg-charcoal">
        <table className="min-w-[820px] w-full border-collapse text-left text-sm">
          <thead className="border-b border-bone/12 text-[10px] uppercase tracking-rox text-steel">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Email</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Creado</th>
              <th className="p-4">Accion</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-bone/8 text-bone/76">
                <td className="p-4">{user.name || "Sin nombre"}</td>
                <td className="p-4">{user.email || "Sin email"}</td>
                <td className="p-4">
                  <form action={updateInternalUserRoleAction} className="flex gap-2">
                    <input type="hidden" name="id" value={user.id} />
                    <select name="role" defaultValue={user.role} className="min-h-10 border border-bone/12 bg-ink px-3 text-sm text-bone">
                      <option value="customer">Customer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button type="submit" className="border border-roxgold px-3 text-[10px] font-bold uppercase tracking-rox text-roxgold">
                      Guardar
                    </button>
                  </form>
                </td>
                <td className="p-4">{new Date(user.createdAt).toLocaleDateString("es-AR")}</td>
                <td className="p-4 text-xs uppercase tracking-rox text-bone/45">Autorizado</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
