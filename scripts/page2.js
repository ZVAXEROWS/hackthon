document.getElementById()
function changeBackground(weatherCondition) {
  const weatherGifs = {
    'very hot': 'url("clear_sky.gif")',
    'hot': 'url("clear_sky.gif")',
    'warm': 'url("clear_sky.gif")',
    'dusty': 'url("clouds.gif")',
    'Snowy': 'url("snow.gif")',
    'cold': 'url("snow.gif")',
    'default': 'url("default.gif")'
  };

  document.body.style.backgroundImage = weatherGifs[weatherCondition] || weatherGifs['default'];
}