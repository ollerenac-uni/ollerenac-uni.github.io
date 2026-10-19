(() => {
  'use strict';
  const scenes = [
    {
      name:'Estado previo',context:'Caso común · inventario anterior a la campaña',title:'Una referencia anterior permite comparar',
      narrative:['El instructor conserva el inventario y el estado de configuración antes de la emulación. El alumno vincula esos datos con los activos del caso, sus servicios y sus fechas, antes de interpretar hallazgos.'],
      description:'La referencia previa reúne versiones, paquetes, servicios y permisos relevantes de los activos. Los registros de la campaña se conservan por separado. Sus fechas permiten distinguir una condición preexistente de un cambio posterior.',
      evidence:'Inventario y configuración de referencia anteriores a la campaña, con procedencia y fecha.',
      records:[{source:'Inventario del activo',detail:'Identificador del equipo, sistema, paquete o producto, versión y revisión, servicio, función y responsable. Un nombre o una dirección no bastan para identificar un activo.'},{source:'Estado previo del entorno',detail:'Configuraciones y permisos conservados con fecha y zona horaria, procedencia y relación con el activo. Si no existe referencia anterior, se registra la limitación.'}],
      boundary:'La fecha de análisis no sustituye la del estado capturado. Una condición observada después no se presenta automáticamente como causa del incidente.',
      action:'Identificar el activo y su servicio, comprobar las fechas y distinguir qué información corresponde al estado anterior a la campaña.',
      questions:['¿El inventario corresponde al mismo activo y periodo?','¿Qué versión y configuración estaban presentes antes?','¿Qué comparación no puede hacerse por falta de datos?'],
      result:'Una ficha de activo y estado previo con fuentes, fechas y limitaciones.',
      caption:'Inventario y configuración anteriores → actividad de la campaña → comparación con evidencia conservada.',
      nodes:['instructor','identity','service','endpoint','context','learner'],edges:['compare']
    },
    {
      name:'Hallazgos',context:'Validación · informe de escaneo conservado',title:'Un hallazgo debe ser aplicable al activo',
      narrative:['El alumno recibe un informe con una posible vulnerabilidad basada en la versión anunciada y una advertencia de configuración. Contrasta cada hallazgo con el inventario real y los requisitos descritos en su referencia técnica.'],
      description:'El informe de escaneo aporta candidatos, método, destino y fecha. Se compara producto, versión y revisión instalada con las condiciones de afectación, sin dar por cierta la vulnerabilidad por el texto del aviso.',
      evidence:'Informe de escaneo, inventario de paquetes y extracto de la referencia técnica con procedencia.',
      records:[{source:'Informe de escaneo',detail:'Activo y servicio, fecha, método, comprobación realizada y limitaciones. Distinguir una identificación por respuesta del servicio de una comprobación autenticada de paquetes o configuración.'},{source:'Referencia de afectación',detail:'Producto, versiones o revisiones afectadas, requisitos y corrección indicada. Una versión anunciada puede ser insuficiente para decidir el estado real del paquete.'}],
      boundary:'El resultado puede ser aplicable, descartado con evidencia o pendiente. No se entrega un identificador de vulnerabilidad inventado ni se supone que Caldera haya explotado el hallazgo.',
      action:'Contrastar cada hallazgo con el activo y la referencia. Registrar qué condición se cumple, cuál no y cuál todavía no puede comprobarse.',
      questions:['¿Coincide producto, versión y revisión?','¿Se cumplen los requisitos de afectación?','¿Qué dato permite confirmar o descartar la aplicabilidad?'],
      result:'Una tabla de hallazgos con estado de validación, evidencia y datos pendientes.',
      caption:'Informe → inventario real → requisitos de afectación → decisión de aplicabilidad.',
      nodes:['service','context','learner','casefile'],edges:['compare','case-save']
    },
    {
      name:'Exposición',context:'Configuración, permisos y alcance accesible',title:'Comprobar qué está expuesto y para quién',
      narrative:['Una versión afectada y una condición accesible son hechos distintos. El alumno revisa configuración, permisos y comprobaciones de acceso del periodo para precisar qué identidad o segmento puede alcanzar el recurso.'],
      description:'Se contrastan el estado previo del servicio, la identidad usada en las comprobaciones y el alcance de red documentado. Los registros de la campaña se usan únicamente para sostener la actividad que realmente muestran.',
      evidence:'Configuración y permisos del servicio, comprobaciones de acceso y registros del caso.',
      records:[{source:'Configuración y permisos',detail:'Recurso, servicio, identidad o grupo, permiso efectivo y condiciones necesarias para usarlo. Una lista de permisos aislada de la identidad y del recurso es insuficiente.'},{source:'Alcance y actividad observada',detail:'Origen, destino, protocolo, fecha y resultado de comprobaciones de acceso. Los registros pueden mostrar uso de un servicio sin acreditar la explotación de una vulnerabilidad.'}],
      boundary:'Accesible, vulnerable y explotado son conclusiones diferentes. La ausencia de un evento tampoco acredita que una condición no haya sido utilizada.',
      action:'Formular la exposición en términos concretos: qué recurso, desde dónde, con qué identidad y qué acción permite. Diferenciarlo de la actividad comprobada en la campaña.',
      questions:['¿Qué origen e identidad alcanzan el recurso?','¿El permiso es efectivo en ese contexto?','¿Los datos muestran una condición, un acceso o una explotación comprobada?'],
      result:'Una condición de exposición descrita y respaldada, con alcance temporal y límites de atribución.',
      caption:'Recurso + origen + identidad + permiso efectivo: alcance comprobado de la exposición.',
      nodes:['service','endpoint','telemetry','context','learner','kibana','elasticsearch'],edges:['usage','local-record','shipping','search','query','compare']
    },
    {
      name:'Prioridad',context:'Decisión de remediación · impacto sobre el servicio',title:'Corregir primero lo que el contexto justifique',
      narrative:['El alumno compara una posible vulnerabilidad pendiente de validar con una condición de permisos comprobada. Justifica el orden de atención según aplicabilidad, exposición, criticidad y actividad observada, sin reducir la decisión a la puntuación del informe.'],
      description:'Se reúnen hallazgos validados y pendientes, función del servicio, alcance de acceso, controles existentes y evidencia del caso. La propuesta identifica responsable, acción y prueba que demostraría la corrección sin interrumpir la función legítima.',
      evidence:'Tabla de priorización y propuesta de cambio con condiciones de verificación.',
      records:[{source:'Justificación de prioridad',detail:'Aplicabilidad, exposición efectiva, criticidad, señales de uso o explotación comprobadas y controles existentes. Distinguir urgencia de validación de urgencia de corrección.'},{source:'Propuesta de corrección',detail:'Condición que se cambia, responsable, autorización necesaria, impacto posible, prueba posterior y modo de revertir si el servicio deja de funcionar.'}],
      boundary:'No se anuncia que un parche resuelve un permiso mal configurado ni que todo hallazgo alto es prioritario en cualquier contexto. La decisión puede cambiar con nueva evidencia.',
      action:'Ordenar los hallazgos, justificar una corrección y definir cómo se comprobarán su efecto y la continuidad del servicio.',
      questions:['¿Qué condición está realmente comprobada?','¿Qué impacto tiene mantenerla o corregirla?','¿Qué prueba permitiría cerrar el hallazgo?'],
      result:'Un orden de atención argumentado y una propuesta de cambio verificable, con responsable e impacto previsto.',
      caption:'Aplicabilidad + exposición + criticidad + evidencia → prioridad y prueba de corrección.',
      nodes:['service','context','casefile','learner'],edges:['compare','case-save']
    },
    {
      linux:true,mapTitle:'Práctica Linux complementaria: corrección de permisos',
      name:'Corrección',context:'Práctica individual · VM Linux aislada',title:'Retirar la escritura que una cuenta no necesita',
      narrative:['En un servicio web interno de práctica, una cuenta sin función de publicación puede crear archivos en el directorio publicado. El alumno comprueba esa condición y retira únicamente el permiso innecesario, conservando la lectura del servicio y la publicación autorizada.'],
      description:'Se pasa expresamente a una VM Linux aislada. Se conservan los permisos y el estado inicial, se comprueba la creación de un archivo inocuo con una cuenta de prueba y se corrige su autorización de escritura.',
      evidence:'Estado inicial y posterior de permisos, identidad efectiva y pruebas sobre archivos inocuos.',
      records:[{source:'Referencia y reproducción inicial',detail:'Permisos efectivos del directorio, propietario, grupos y ACL cuando existan; identidad de cada prueba y creación de un archivo inocuo. Guardar el estado necesario para revertir.'},{source:'Cambio aplicado',detail:'Diferencia de configuración que retira la escritura no requerida sin concederla por otro grupo o regla. Mantener lectura para el servicio y escritura para el publicador autorizado.'}],
      boundary:'Es un complemento operativo, no un servidor que se afirme comprometido por Wizard Spider. No se modifica el rango compartido ni se ejecuta contenido malicioso. Los estados de la matriz son criterios pendientes de comprobar.',
      action:'Reproducir la creación de un archivo de prueba con la cuenta que no debería publicar, conservar la referencia de permisos y aplicar una corrección mínima y reversible.',
      questions:['¿Qué permiso efectivo hace posible la creación?','¿La cuenta obtiene escritura por alguna otra vía?','¿Puede conservarse la función legítima con un cambio menor?'],
      result:'Un cambio acotado de permisos, con estado previo conservado y justificación. Su eficacia debe verificarse en la escena siguiente.',
      caption:'Complemento Linux: comprobar escritura no requerida → conservar referencia → corregir permisos.',
      nodes:[],edges:[]
    },
    {
      linux:true,mapTitle:'Práctica Linux complementaria: verificación de la corrección',
      name:'Verificación',context:'Cierre del hallazgo · efecto y continuidad',title:'Demostrar la corrección y la función legítima',
      narrative:['Tras el cambio se repiten las mismas pruebas con identidades y recurso documentados. La cuenta sin función de publicación debe perder la capacidad de crear archivos, mientras el publicador y el servicio web conservan su función.'],
      description:'Se contrasta la prueba inicial y la posterior. La comprobación incluye la denegación esperada para la cuenta de prueba, la publicación autorizada y la lectura de un documento conocido a través del servicio web.',
      evidence:'Matriz antes/después con identidad, recurso, resultado y referencia a cada prueba.',
      records:[{source:'Prueba de restricción',detail:'Repetir la creación de un archivo inocuo como la misma cuenta sin función de publicación y con la identidad efectiva comprobada. Una sesión distinta o un fallo de conexión no sustituyen una prueba de autorización.'},{source:'Pruebas de continuidad',detail:'Comprobar publicación por la cuenta autorizada y lectura del documento conocido mediante el servicio web. Conservar resultados y permisos posteriores; revertir si falla la función legítima.'}],
      boundary:'Un cambio de permisos o un nuevo escaneo por sí solos no acreditan la corrección. Se cierra únicamente la condición y el alcance probados; no se afirma que el sistema carezca de otras vulnerabilidades.',
      action:'Repetir las pruebas, contrastarlas con la referencia y registrar si la corrección es eficaz, falla o requiere ajustes. Documentar el resultado en el expediente individual.',
      questions:['¿La misma cuenta ya no puede crear el archivo?','¿El publicador autorizado y la lectura web siguen funcionando?','¿Qué alcance exacto puede darse por corregido?'],
      result:'Una corrección comprobada con prueba negativa y continuidad legítima, o una limitación documentada y un siguiente ajuste propuesto.',
      caption:'Misma prueba y cuenta → escritura denegada → publicación y lectura legítimas → expediente.',
      nodes:[],edges:[]
    }
  ];
  const overview={
    context:'Vista general · módulo 02 · 4 horas',title:'Del hallazgo a una corrección comprobada',
    narrative:['El recorrido parte del inventario y el estado previo a la campaña. El alumno valida hallazgos de un informe, precisa la exposición y justifica qué atender primero. Los registros conservados aportan contexto de actividad; no se supone que toda vulnerabilidad detectada haya sido explotada.',
      'Las dos escenas finales pasan a un servicio Linux de práctica, expresamente complementario. Allí se retira una escritura no requerida y se comprueba que la publicación autorizada y la lectura web siguen funcionando. Cada escena muestra sus tareas y fuentes; la visualización no ejecuta pruebas reales.'],
    description:'Se contrasta el estado previo con hallazgos y evidencia del caso; se prioriza una corrección y se verifica en una VM Linux complementaria.',
    evidence:'Inventario, informe de escaneo, referencia técnica, permisos, pruebas de acceso y expediente de corrección.',
    boundary:'Basado en el módulo 02 de modelo-temario.docx. Los materiales y el piloto del laboratorio siguen pendientes de preparar y validar.',
    action:'Contrastar hallazgos con el estado previo del entorno, justificar prioridades y comprobar una corrección de configuración en el servicio Linux de práctica.',
    result:'Una tabla de hallazgos argumentada y una corrección de permisos verificada con continuidad del servicio.',
    caption:'Estado previo → hallazgos → exposición → prioridad → corrección Linux → verificación.'
  };
  const components={
    caldera:['Servidor Caldera','Orquesta la emulación sobre agentes preinstalados. Aporta actividad de referencia para el caso común.','No es el escáner de vulnerabilidades ni prueba que cada hallazgo haya sido explotado.'],
    instructor:['Instructor','Conserva inventario y configuración previos, prepara informes y comprueba la procedencia de los materiales.','Debe verificarse qué dato es previo y cuál posterior a la campaña; el piloto no se presenta como realizado.'],
    identity:['Identidad / Active Directory','Identifica usuarios y participa en sus permisos en el entorno del caso. Su función y sus dependencias afectan a la criticidad.','Inventario, configuración y contexto de cuentas del periodo examinado.'],
    service:['Servicio de archivos','Servicio del caso común cuya versión, configuración y función se contrastan con los hallazgos disponibles.','Su presencia en el mapa no implica que tenga una vulnerabilidad ni que haya sido comprometido.'],
    endpoint:['Puesto Windows','Activo observado en la campaña y consumidor del servicio de documentos.','Inventario y evidencias fechadas. El estado posterior no sustituye la referencia previa.'],
    telemetry:['Registros y Elastic Agent','Agrupa las fuentes locales y su recolector. Los eventos se envían a Elasticsearch.','Las versiones, los paquetes y los permisos pueden requerir inventarios o capturas adicionales; no se supone que todo esté en los logs.'],
    fleet:['Fleet / Fleet Server','Administra políticas y estado del recolector.','Los eventos tienen como destino Elasticsearch; Fleet no se representa como salto intermedio.'],
    elasticsearch:['Elasticsearch','Almacena los registros conservados de la campaña para su consulta.','No se presupone que contenga automáticamente los informes de escaneo o las fichas de permisos.'],
    kibana:['Kibana','Permite contrastar la actividad registrada en el periodo del caso.','La actividad observada se distingue de la existencia de una vulnerabilidad y de su explotación.'],
    context:['Materiales de validación','Tarjeta de documentos: inventario previo, informe, referencia de afectación, permisos y contexto de servicio. Cambia de etiqueta con el paso.','Se entregarán como materiales conservados con fecha y procedencia. La tarjeta no es un servidor de escaneo.'],
    casefile:['Expediente individual','Recoge hallazgos aplicables, descartados o pendientes, prioridades y pruebas de corrección.','Cada afirmación cita una fuente y distingue condiciones observadas de hipótesis de explotación.'],
    learner:['Alumno / analista','Valida y prioriza hallazgos de forma individual. La corrección se realiza después en una VM Linux aislada.','El criterio es demostrar aplicabilidad, efecto y continuidad, no repetir la severidad del informe.']
  };
  const edges=[
    {id:'instructor-control',from:'instructor',to:'caldera',type:'management',label:'Preparación y referencia de la campaña'},
    {id:'emulation',from:'caldera',to:'endpoint',type:'control',both:true,label:'Canal con el agente preinstalado; no representa un escaneo'},
    {id:'identity-service',from:'identity',to:'service',type:'management',label:'Dependencia del servicio respecto a identidad'},
    {id:'usage',from:'endpoint',to:'service',type:'query',label:'Acceso al servicio desde el puesto'},
    {id:'local-record',from:'endpoint',to:'telemetry',type:'data',label:'Actividad registrada'},
    {id:'shipping',from:'telemetry',to:'elasticsearch',type:'data',label:'Envío de eventos'},
    {id:'policy',from:'fleet',to:'telemetry',type:'management',label:'Gestión del recolector'},
    {id:'query',from:'kibana',to:'elasticsearch',type:'query',both:true,label:'Consultas y resultados del caso'},
    {id:'search',from:'learner',to:'kibana',type:'query',label:'Contraste con actividad conservada'},
    {id:'compare',from:'learner',to:'context',type:'query',route:'under',label:'Consulta de inventarios e informes; relación de trabajo'},
    {id:'case-save',from:'learner',to:'casefile',type:'query',route:'horizontal',label:'Documentación de validación y prioridad'}
  ];
  const v=(label,detail,icon='icon-logs')=>[label,detail,icon];
  const motionSequences=[
    {type:'query',endTitle:'Referencia previa identificada',endDetail:'Quedan vinculados activo, inventario y configuración con fechas y procedencia; los vacíos se registran.',steps:[
      {nodes:['instructor','context'],title:'Conservar el estado anterior',view:{context:v('Estado previo','Fecha y procedencia','icon-archive')}},
      {nodes:['service','identity','endpoint'],title:'Identificar activos y servicios'},
      {edge:'compare',nodes:['learner','context'],title:'Consultar versiones y configuración',view:{context:v('Inventario previo','Paquetes, revisión y permisos')}},
      {edge:'case-save',nodes:['learner','casefile'],title:'Anotar la referencia temporal',view:{casefile:v('Referencia del activo','Antes y después diferenciados','icon-archive')}}
    ]},
    {type:'query',endTitle:'Aplicabilidad sustentada o pendiente',endDetail:'Cada hallazgo queda aplicable, descartado con evidencia o pendiente de un dato concreto.',steps:[
      {edge:'compare',nodes:['learner','context'],title:'Leer el informe de escaneo',view:{context:v('Informe de escaneo','Método, destino y fecha','icon-search')}},
      {edge:'compare',nodes:['learner','context'],title:'Contrastar el paquete real',view:{context:v('Inventario instalado','Producto, versión y revisión')}},
      {nodes:['learner','context'],title:'Comprobar requisitos de afectación',view:{context:v('Referencia técnica','Requisitos y afectación','icon-logs')}},
      {edge:'case-save',nodes:['learner','casefile'],title:'Registrar el estado del hallazgo',view:{casefile:v('Hallazgo contrastado','Aplicable, descartado o pendiente','icon-archive')}}
    ]},
    {type:'query',endTitle:'Exposición y actividad diferenciadas',endDetail:'Se describe quién puede hacer qué y desde dónde. La explotación solo se afirma si la evidencia la sostiene.',steps:[
      {nodes:['service','context'],title:'Examinar configuración y permisos',view:{context:v('Configuración previa','Recurso y permiso efectivo','icon-settings')}},
      {edge:'usage',nodes:['endpoint','service'],title:'Comprobar el alcance de acceso'},
      {edge:'search',nodes:['learner','kibana'],title:'Contrastar la actividad del caso'},
      {edge:'case-save',nodes:['learner','casefile'],title:'Delimitar lo comprobado',view:{casefile:v('Exposición comprobada','Alcance, fechas y límites','icon-archive')}}
    ]},
    {type:'query',endTitle:'Prioridad y verificación definidas',endDetail:'La propuesta indica qué corregir, por qué, quién lo autoriza y qué prueba acreditará el efecto.',steps:[
      {edge:'compare',nodes:['learner','context'],title:'Comparar hallazgos y certeza',view:{context:v('Hallazgos y límites','Comprobados y pendientes')}},
      {nodes:['service','context'],title:'Valorar criticidad e impacto',view:{context:v('Impacto del servicio','Exposición y controles','icon-service')}},
      {nodes:['learner'],title:'Justificar el orden de atención'},
      {edge:'case-save',nodes:['learner','casefile'],title:'Definir cambio y prueba posterior',view:{casefile:v('Propuesta de corrección','Responsable, efecto y reversión','icon-archive')}}
    ]},
    {type:'protection',endTitle:'Cambio acotado aplicado; falta verificar',endDetail:'Se conserva el estado previo y se retira la escritura no requerida. El cierre depende de las pruebas siguientes.',steps:[
      {nodes:['linux-learner','linux-directory'],title:'Pasar a la práctica Linux aislada'},
      {nodes:['trial-account','linux-directory'],column:1,title:'Reproducir la escritura no requerida'},
      {nodes:['linux-learner','linux-control'],title:'Conservar permisos e identidad'},
      {nodes:['linux-control','linux-directory'],title:'Retirar únicamente la escritura indebida'}
    ]},
    {type:'protection',endTitle:'Efecto y continuidad documentados',endDetail:'El expediente recoge pruebas antes/después y limita el cierre a la condición realmente comprobada.',steps:[
      {nodes:['trial-account','linux-directory'],column:2,title:'Repetir la prueba de la cuenta restringida'},
      {nodes:['publisher','linux-directory'],column:2,title:'Comprobar la publicación autorizada'},
      {nodes:['web-client','linux-service'],column:2,title:'Comprobar la lectura por el servicio web'},
      {nodes:['linux-learner','linux-file'],title:'Documentar el resultado y sus límites'}
    ]}
  ];
  const stepNarratives=[
    [
      'Se destacan el instructor y el estado previo conservado. Antes de la emulación se prepararán inventario y configuración con fecha y procedencia. Esa referencia permitirá comparar sin confundir una condición preexistente con un cambio posterior.',
      'Se iluminan identidad, servicio de archivos y puesto Windows. El alumno identifica qué activo y función corresponden a cada captura; compartir una dirección o un nombre parecido no basta para unir datos de momentos distintos.',
      'La conexión llega al inventario previo. Se consultan producto, paquete, versión o revisión instalada, servicio y permisos relevantes. Estos materiales pueden proceder de capturas adicionales a los registros de Elastic.',
      'El recorrido termina en el expediente: se documenta qué referencia es anterior a la campaña, qué evidencia corresponde al periodo posterior y qué comparación falta por no disponer de datos.'
    ],
    [
      'La tarjeta muestra el informe de escaneo conservado. El alumno lee destino, fecha, método y prueba realizada; un aviso basado en una versión anunciada es una pista que todavía debe contrastarse.',
      'El foco pasa al inventario realmente instalado. Se compara producto, versión y revisión del paquete con el informe, en lugar de decidir solo por el texto o la puntuación del hallazgo.',
      'La tarjeta cambia a la referencia técnica. El alumno comprueba las condiciones de afectación y las confronta con los datos del activo. Si falta una revisión o requisito, deja el hallazgo pendiente y pide ese dato.',
      'La decisión se incorpora al expediente: aplicable, descartado con evidencia o pendiente. Este estado describe la validez del hallazgo; no afirma que el adversario lo haya explotado.'
    ],
    [
      'Se destacan el servicio y su configuración previa. El alumno identifica recurso, identidad o grupo y permiso efectivo para determinar qué acción permite realmente la condición observada.',
      'La conexión entre puesto y servicio representa el acceso que debe contrastarse con comprobaciones fechadas. El alumno precisa desde qué origen y con qué identidad se alcanza el recurso, sin suponer que esté abierto a toda la red.',
      'La consulta llega a Kibana para revisar la actividad conservada de la campaña. Un acceso o uso registrado puede aportar contexto, pero no demuestra por sí solo la explotación de la vulnerabilidad candidata.',
      'El expediente reúne lo comprobado: recurso, origen, identidad, acción permitida y periodo. Se separa la condición de exposición de la actividad observada y de cualquier hipótesis aún sin confirmar.'
    ],
    [
      'El alumno compara los hallazgos contrastados y los pendientes. Una posible vulnerabilidad de versión puede requerir más datos, mientras una configuración de permisos comprobada ya permite proponer una corrección.',
      'Se iluminan el servicio y la ficha de impacto. La decisión incorpora función, alcance de acceso, controles y consecuencias de corregir, sin trasladar automáticamente la puntuación del informe a la prioridad operativa.',
      'El foco queda en el analista. Justifica qué atender primero y por qué, distinguiendo la urgencia de validar un hallazgo de la urgencia de corregir una exposición que ya se ha demostrado.',
      'La propuesta llega al expediente con condición a cambiar, responsable, autorización, impacto previsto y prueba posterior. Para la ejecución individual, las escenas siguientes pasan a un servicio Linux complementario.'
    ],
    [
      'La vista cambia a una VM Linux de práctica, separada del caso Windows. El alumno trabajará sobre un servicio web interno que publica documentos; este complemento permite probar una corrección sin modificar la infraestructura compartida.',
      'Se destacan la cuenta sin función de publicación y el directorio, junto a la columna inicial. El criterio de partida es demostrar que esa cuenta puede crear un archivo inocuo donde no debería poder hacerlo; la tabla expresa resultados esperados, todavía no medidos.',
      'El alumno conserva el estado de permisos y su identidad efectiva antes de cambiar nada: propietario, grupos y listas de permisos cuando existan. La referencia debe permitir revertir y repetir la misma comprobación.',
      'Se destacan el control de permisos y el directorio. El alumno retira la escritura que la cuenta no necesita, comprobando que no la conserve por otra regla o grupo y que la lectura del servicio y el publicador autorizado mantengan sus permisos.'
    ],
    [
      'Se repite la creación del archivo con la misma cuenta sin función de publicación. La columna corregida indica el criterio: debe denegarse por autorización; un fallo de conexión o probar con otra identidad no demostraría la corrección.',
      'El foco pasa al publicador autorizado y al directorio. Se comprueba que esta cuenta conserva la creación legítima de archivos, para evitar resolver la exposición suprimiendo también la función necesaria.',
      'Se destacan el cliente y el servicio web. El alumno solicita un documento conocido mediante el servicio y comprueba su lectura. Tener permisos aparentemente correctos en el directorio no sustituye esta prueba de funcionamiento.',
      'El alumno registra en su expediente las pruebas iniciales y posteriores, la diferencia de permisos y las limitaciones. Si falla la continuidad, revierte o ajusta el cambio; si las pruebas pasan, cierra únicamente la condición y el alcance comprobados.'
    ]
  ];
  window.BlueTeamModule={meta:{mapTitle:'Red adversaria ↔ red objetivo → red de Elastic'},scenes,overview,components,edges,motionSequences,stepNarratives};
})();
