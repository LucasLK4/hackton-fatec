// Máscara de CPF simples e funcional
document.addEventListener("DOMContentLoaded", () => {
  const cpfInput = document.getElementById("cpf");
  if (!cpfInput) return;

  cpfInput.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, ""); // remove tudo que não é número
    if (value.length > 11) value = value.slice(0, 11);

    // aplica a máscara: 000.000.000-00
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    this.value = value;
  });
});
