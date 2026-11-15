// Swipe Purge: busca as chaves OAuth das redes no admin (guardadas cifradas lá)
// e imprime linhas "export NOME='valor'" para o shell carregar antes de subir o Postiz.
// Sem ADMIN_URL ou POSTIZ_ADMIN_TOKEN, não faz nada (o Postiz sobe sem as redes).
const url = process.env.ADMIN_URL;
const token = process.env.POSTIZ_ADMIN_TOKEN;
if (!url || !token) {
  console.error('[swipe] sem ADMIN_URL/POSTIZ_ADMIN_TOKEN: chaves das redes nao carregadas');
  process.exit(0);
}
const permitidas = /^(TIKTOK|YOUTUBE|FACEBOOK|INSTAGRAM|THREADS)_(CLIENT|APP)_(ID|SECRET)$/;
try {
  const r = await fetch(`${url.replace(/\/$/, '')}/api/postiz/chaves`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) {
    console.error(`[swipe] admin respondeu ${r.status}: chaves das redes nao carregadas`);
    process.exit(0);
  }
  const chaves = await r.json();
  let n = 0;
  for (const [k, v] of Object.entries(chaves)) {
    if (!permitidas.test(k) || typeof v !== 'string') continue;
    console.log(`export ${k}='${v.replace(/'/g, `'\''`)}'`);
    n++;
  }
  console.error(`[swipe] ${n} chaves das redes carregadas do admin`);
} catch (e) {
  console.error(`[swipe] falha ao buscar chaves no admin: ${e?.name ?? 'erro'}`);
}
