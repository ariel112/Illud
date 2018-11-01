$(document).ready(function(){

console.log('iniciado servicios');


/*Editor de texto para html*/
 var html = CodeMirror( document.getElementById('html'),
				  {
				    mode: 'xml',
				    theme: 'dracula',
				    tabsize: 50,
				    lineNumbers: true,
				    autoCloseTags: true,
				    extraKeys: {"Ctrl-Space": "autocomplete"}
				  });


/*Editor de texto pra css*/
var css = CodeMirror(document.getElementById('css'),
				{
					mode: 'css',
				    theme: 'dracula',
				    tabsize: 50,
				    lineNumbers: true,
				    autoCloseTags: true,
				    extraKeys: {"Ctrl-Space": "autocomplete"}
				});



/*Editor de texto pra js*/
var js = CodeMirror(document.getElementById('js'),
				{
					mode: 'jsx',
				    theme: 'dracula',
				    tabsize: 50,
				    lineNumbers: true,
				    autoCloseTags: true,
				    extraKeys: {"Ctrl-Space": "autocomplete"}
				});

/*boton que voy a utilzar para correr el codigo*/
var run = $('#run');
//var contenido = $('#contenido');
var contenido = $("#contenido").contents().find("body");

var contenido_css = $("#contenido").contents().find("head");

var contenido_js = $("#contenido").contents().find("body");

/*Esta funcion me pinta el iframe que tengo en mi pagina web*/
run.click(function(event) {

	/*funcion para que aunque se actualice la pagina queden los datos en el navegador
	localStorage.setItem('html', html.getValue());
	localStorage.setItem('css', css.getValue());
	localStorage.setItem('js', js.getValue());
    
   */
    contenido.empty();
    contenido_css.empty();
    contenido_js.empty();
   
   /*obtengo el codigo del la sesion del navegador
	var local_html = localStorage.getItem('html'); 
	var local_css  = localStorage.getItem('css');
	var local_js   = localStorage.getItem('js')
  
  */
 	/* almacena el codigo que esta en mis tres cuadros html css js*/
	   var codigo_html = html.getValue();    
	   var codigo_css = css.getValue();
	   var codigo_js = js.getValue();
	 

		/*cargo la informacion desde el navegador localStorage*/	 
	/*   var codigo_html = local_html;    
	   var codigo_css = local_css;
	   var codigo_js = local_js;
*/

 contenido_css.append(`
						<style type="text/css">
						   ${codigo_css} 
						<style>
 				`);
 contenido.append(codigo_html);
 contenido_js.append(`
					<script type="text/javascript">
					  ${codigo_js}
					</script>
 					`);

   return false;
   });


//redimencionar los elementos que tengo en los cuadros 
    $('.container-pen').layout({
 
   applyDefaultStyles: false,
  east: {
    spacing_closed: 20, //toggler width
    spacing_open: 20,
    togglerLength_closed: 80, //toggler height (length)
    togglerLength_open: 80,
	togglerContent_open:   '',
    togglerContent_closed: 'JS',
    size:'33%',
    resizeChildLayout:"resizeChildren"

    	}
    	,

   west: {
    spacing_closed: 20, //toggler width
    spacing_open: 20,
    togglerLength_closed: 180, //toggler height (length)
    togglerLength_open: 80,
	  togglerContent_open:   '',
    togglerContent_closed: 'HTM',
	  size:'33%',
	  padding:0
		},
  /*cuadro de abajo de la pantalla*/
   south: {
    spacing_closed: 10, //toggler width
    spacing_open: 10,
    togglerLength_closed: 0, //toggler height (length)
    togglerLength_open: 0,
    size:'47%',
    maxSize: '83%',
    minSize: '3%'
		},
	center:{
		size:'33%'
	},
	cssDemo:{overflow:"auto",padding:"10px"}
});

/*modal para los shorcuts*/
$('#shorcuts').click(function() {
	$('.ui.modal')
  .modal('show');
});

/*Ventana modal para compartir los proyectos*/
$('.ui.dropdown')
  .dropdown();


/*efecto de sugerencia de busqueda */
$('.ui.search').keyup(function(){
	$('.ui.search')
  .search({
    source: content
  });
});

var content = [
  { title: 'Andorra' },
  { title: 'United Arab Emirates' },
  { title: 'Afghanistan' },
  { title: 'Antigua' },
  { title: 'Anguilla' },
  { title: 'Albania' },
  { title: 'Armenia' },
  { title: 'Netherlands Antilles' },
  { title: 'Angola' },
  { title: 'Argentina' },
  { title: 'American Samoa' },
  { title: 'Austria' },
  { title: 'Australia' },
  { title: 'Aruba' },
  { title: 'Aland Islands' },
  { title: 'Azerbaijan' },
  { title: 'Bosnia' },
  { title: 'Barbados' },
  { title: 'Bangladesh' },
  { title: 'Belgium' },
  { title: 'Burkina Faso' },
  { title: 'Bulgaria' },
  { title: 'Bahrain' },
  { title: 'Burundi' }
 
];












});


