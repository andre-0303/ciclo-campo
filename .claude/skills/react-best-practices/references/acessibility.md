# Checklist de Acessibilidade — CicloCampo

O app é usado por professores em campo, ao sol, muitas vezes com uma mão ocupada.
Acessibilidade aqui é também usabilidade.

## Checklist por componente

### Botões e elementos clicáveis

- [ ] `<button>` para ações, `<a>` para navegação — nunca `<div onClick>`
- [ ] `aria-label` quando o ícone não tem texto visível
- [ ] Área de toque mínima de 44x44px (`min-h-11 min-w-11`)
- [ ] Estado de foco visível (`focus:ring-2 focus:ring-green-500`)

### Formulários

- [ ] Todo `<input>` tem um `<label>` associado via `htmlFor`
- [ ] Mensagens de erro vinculadas ao campo via `aria-describedby`
- [ ] Campos obrigatórios marcados com `required` e `aria-required`

### Imagens

- [ ] `alt` descritivo em fotos de cultivo
- [ ] `alt=""` em imagens decorativas

### Feedback ao usuário

- [ ] Loading states sempre visíveis
- [ ] Erros explicam O QUÊ deu errado e O QUE fazer
- [ ] Ações destrutivas pedem confirmação

### Contraste

- [ ] Texto normal: mínimo 4.5:1
- [ ] Texto grande (>18px): mínimo 3:1
- [ ] Preferir `text-gray-800` para textos de conteúdo
- [ ] Nunca usar só cor para comunicar estado (sempre adicionar ícone ou texto)

## Exemplo correto

```tsx
// ❌ Inacessível
<div onClick={handleIrrigation} className="p-2">
  <WaterIcon />
</div>

// ✅ Acessível
<button
  onClick={handleIrrigation}
  className="min-h-11 min-w-11 p-2 rounded focus:ring-2 focus:ring-green-500"
  aria-label="Registrar irrigação"
>
  <WaterIcon aria-hidden="true" />
</button>
```
