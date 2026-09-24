// Writes go through the password-checked "edit" backend function, so anyone
// with the edit password can change content without a Base44 account.
import { base44 } from '@/api/base44Client';

const KEY = 'history_edit_password';

export function getEditPassword() {
  try { return sessionStorage.getItem(KEY) || ''; } catch { return ''; }
}
export function setEditPassword(pw) {
  try { pw ? sessionStorage.setItem(KEY, pw) : sessionStorage.removeItem(KEY); } catch { /* ignore */ }
}

// Returns true if the server accepts the password.
export async function checkEditPassword(password) {
  try {
    const res = await base44.functions.invoke('edit', { password, action: 'check' });
    return !!res.data?.ok;
  } catch {
    return false;
  }
}

async function call(entity, method, args) {
  try {
    const res = await base44.functions.invoke('edit', { password: getEditPassword(), entity, method, args });
    return res.data?.result;
  } catch (err) {
    const msg = err?.response?.data?.error || err?.message || 'Edit failed';
    alert(`Couldn't save: ${msg}`);
    throw err;
  }
}

const METHODS = ['create', 'update', 'delete', 'bulkCreate', 'bulkUpdate', 'updateMany', 'deleteMany'];

// Usage mirrors base44.entities: editDb.ContentBlock.update(id, data)
export const editDb = new Proxy({}, {
  get: (_, entity) => Object.fromEntries(
    METHODS.map((m) => [m, (...args) => call(String(entity), m, args)])
  ),
});

// Mirrors base44.integrations.Core.UploadFile({ file }) → { file_url }
// Without the edit password (e.g. a student submission) it uses the normal upload.
export async function uploadFile({ file }) {
  if (!getEditPassword()) return base44.integrations.Core.UploadFile({ file });
  try {
    const res = await base44.functions.invoke('edit', { password: getEditPassword(), file });
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.error || err?.message || 'Upload failed';
    alert(`Couldn't upload: ${msg}`);
    throw err;
  }
}
