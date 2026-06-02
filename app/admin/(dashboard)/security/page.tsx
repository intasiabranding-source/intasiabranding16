import { getSecurityLogs } from "@/app/actions/admin/settings";
import { formatDate } from "@/lib/utils";
import { AuditLog, LoginHistory } from "@prisma/client";

export default async function AdminSecurityPage() {
  const { loginHistory, auditLogs } = await getSecurityLogs();

  return (
    <div>
      <h1 className="text-2xl font-bold">Security</h1>
      <p className="text-muted-foreground">Login history, audit logs, and session monitoring.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-semibold mb-4">Login History</h2>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map((log: LoginHistory) => (
                  <tr key={log.id} className="border-t">
                    <td className="p-3">{log.email}</td>
                    <td className="p-3">
                      <span className={log.success ? "text-green-500" : "text-red-500"}>
                        {log.success ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{formatDate(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-4">Audit Logs</h2>
          <div className="rounded-xl border max-h-96 overflow-y-auto">
            {auditLogs.map((log: AuditLog) => (
              <div key={log.id} className="border-b p-3 text-sm">
                <p className="font-medium">{log.action}</p>
                <p className="text-muted-foreground">
                  {log.entity} {log.entityId} · {formatDate(log.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
