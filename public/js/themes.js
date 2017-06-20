// --------------------------------------------------------------------------------------
// PAGE THEME
// ----------------------------------------------------------------------

function updateTheme(theme) {
  console.log('updating theme to ' + theme);
  document.getElementById("selected-theme").setAttribute("href", "/css/" + theme + "-theme.css");
  document.getElementById("save-config").src = "img/" + theme + "/save.png";
  document.getElementById("upload-config").src = "img/" + theme + "/upload.png";
  document.getElementById("config-menu").src = "img/" + theme + "/config.png";
}

updateTheme('dark');
