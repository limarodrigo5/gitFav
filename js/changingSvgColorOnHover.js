export function changeSvgColorOnHover() {
  const svgPath = document.querySelector("#favorite-star path");

  svgPath.addEventListener("mouseenter", () => {
    svgPath.setAttribute("fill", "#065E7C");
  });

  svgPath.addEventListener("mouseleave", () => {
    svgPath.setAttribute("fill", "white");
  });
}
