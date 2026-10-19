(() => {
  'use strict';
  const scenes = [
    {
      name:'Se configura un inicio automático de prueba', context:'Diseño del caso · procedimiento Caldera pendiente de piloto',
      narrative:[
        'El recorrido comienza a la izquierda: el instructor prepara una emulación controlada en Caldera. El servidor se comunica con un agente previamente instalado dentro del equipo Windows de la red objetivo. Ese agente configurará una entrada Run, que indica qué programa debe iniciarse al abrir una sesión.',
        'El cambio deja un punto de partida para la investigación, pero todavía no demuestra que el programa se haya ejecutado. En paralelo se preparará un cambio autorizado comparable. Los dos avisos llegarán al alumno sin revelar su origen; las siguientes escenas seguirán sus registros hasta Elastic y comprobarán sus efectos.'
      ],
      title:'Un programa queda configurado para iniciarse con la sesión',
      description:'Caldera configurará una entrada Run —una configuración de inicio automático de Windows— para lanzar un programa inocuo ya disponible en el perfil del usuario. En una sesión posterior se comprobará si se ejecuta. Habrá un cambio legítimo comparable de software autorizado.',
      evidence:'Sysmon 13 para el cambio de registro; Sysmon 1 para el proceso que lo realiza y la ejecución posterior; estado de la entrada Run, archivo referenciado y contexto del inicio de sesión. Cada fuente se habilitará y validará antes del curso.',
      boundary:'Esta vista explica el diseño docente. El alumno recibirá avisos, registros y contexto operativo, sin el YAML ni el informe de Caldera. Podrá analizar las líneas de comandos que existan en los propios eventos.',
      action:'Partir de dos avisos de cambio de inicio automático en un equipo y un periodo. Investigar ambos con Kibana, los originales y el registro de cambios autorizados.',
      questions:['¿Qué proceso y usuario realizaron cada cambio y a qué programa apunta?','¿El programa llegó a ejecutarse tras iniciar sesión o solo quedó configurado?','¿Qué evidencia respalda una explicación legítima y qué actividad requiere escalarse?'],
      result:'Una cronología breve por cambio, su estado de ejecución y una clasificación sustentada con sus límites. Una ruta inusual o una entrada Run, por sí solas, no acreditan malware ni atribución APT.',
      caption:'La primera escena concreta el origen del caso; el mapa mantiene las mismas redes y componentes para profundizar después en sus registros.',
      motion:'El agente consulta tareas, Caldera responde, el agente configura Run y devuelve el resultado. La ejecución posterior del programa se comprueba en la escena 2.',
      script:'Caldera configurará un inicio automático de prueba y se comprobará su ejecución posterior. El alumno contrastará dos avisos con registros y contexto, sin conocer el guion de comandos.',
      nodes:['instructor','caldera','adversary-agent','activity'], edges:['emulation','execution','instructor-control']
    },
    {
      name:'La actividad deja registros locales', context:'Captura de referencia · instructor; examen en clase · alumno',
      narrative:[
        'La mirada se concentra ahora dentro del equipo Windows. Después de preparar el inicio automático, se abrirá una nueva sesión del usuario. Si el programa inocuo se ejecuta, creará un archivo marcador: un efecto pequeño y comprobable.',
        'Sysmon y el registro de Seguridad permitirán reconstruir cuatro momentos: el cambio de configuración, la sesión, el proceso y el archivo. La copia de originales conserva esa secuencia para contrastarla. Habrá que separar al proceso que cambió Run del programa que se inició después: observar una ejecución no basta para atribuirla al inicio automático.'
      ],
      title:'Del cambio de configuración a la ejecución comprobada',
      description:'Con la entrada Run preparada, se abrirá una nueva sesión del usuario en Windows. El programa inocuo estará diseñado para crear un archivo marcador al ejecutarse. Se conservarán los registros originales y el estado de la entrada para reconstruir lo ocurrido.',
      evidence:'Cambio de configuración, sesión, proceso y efecto del programa, comprobados con las fuentes originales.',
      records:[
        {source:'Sysmon 13 · cambio de registro',detail:'Entrada modificada y proceso que hizo el cambio. Su destino se verifica también en la copia del estado de Run.'},
        {source:'Seguridad 4624 · nueva sesión',detail:'En este caso se preparará un inicio interactivo local: tipo 2. Cuenta, equipo, hora e identificador de sesión.'},
        {source:'Sysmon 1 · creación del proceso',detail:'Programa referenciado, usuario, sesión, hora y árbol de procesos; distinguir el proceso modificador del programa iniciado.'},
        {source:'Sysmon 11 · archivo marcador',detail:'Creación del marcador por el programa. Se relaciona con su evento de proceso mediante ProcessGuid, el identificador del proceso.'}
      ],
      boundary:'La entrada demuestra configuración; el proceso y su marcador demuestran ejecución y un efecto acotado. Atribuir el arranque a Run exige contrastar el árbol de procesos y otros posibles lanzadores. El piloto incluirá pruebas con y sin la entrada, sin ejecutar manualmente el programa.',
      action:'En el Visor de eventos y las copias preservadas, construir la secuencia cambio → nueva sesión → proceso → marcador para ambos avisos. En esta escena se estudia el original; su comparación con Elastic corresponde a la siguiente.',
      questions:['¿El programa que aparece en Sysmon 1 coincide con el referenciado por Run y con la sesión investigada?','¿El marcador fue creado por ese proceso o por otro?','¿La evidencia sostiene un inicio automático, una ejecución por otra vía o una conclusión todavía indeterminada?'],
      result:'Una cronología con referencias a eventos que distinga configuración, ejecución y efecto; documentar por separado la confianza sobre el mecanismo de arranque. La ausencia de un evento, sin comprobar cobertura y periodo, no demuestra que no se ejecutó.',
      caption:'Dos procesos distintos: el modificador se vincula al cambio de Run; el programa iniciado se vincula al archivo marcador.',
      motion:'Mostrar sucesivamente cambio de configuración, sesión, creación del proceso y efecto comprobado. Mantener diferenciados ambos procesos y señalar el vínculo entre el programa y su marcador.',
      script:'Reconstruir con Sysmon 13, Seguridad 4624, Sysmon 1 y Sysmon 11 la configuración, sesión, ejecución y efecto; distinguir ejecución observada de atribución al mecanismo Run.',
      nodes:['activity','sensor','originals'], edges:['local-record']
    },
    {
      name:'Se comprueba la correspondencia con Elastic', context:'Validación individual en clase · captura y configuración conservadas',
      narrative:[
        'El recorrido sale del equipo Windows hacia la red de Elastic. Elastic Agent lee los canales configurados y envía sus registros a Elasticsearch, donde se almacenan e indexan. Kibana permite consultarlos; Fleet y Fleet Server mantienen una relación separada de administración de políticas y estado.',
        'Desde su puesto, el alumno recorrerá el camino en sentido inverso: partirá de un resultado en Kibana y lo contrastará con su original conservado. La comparación de identidad, contenido y fechas comprobará qué llegó y con qué calidad. Que el agente aparezca conectado no demuestra que todos los eventos históricos se hayan recolectado.'
      ],
      title:'Del evento original al documento consultable',
      description:'Elastic Agent lee los canales configurados de Sysmon, Seguridad de Windows y PowerShell, y envía sus eventos a Elasticsearch. Se comprueba qué fuentes se habilitaron y qué eventos existen realmente. Kibana permite consultarlos; Fleet y Fleet Server administran políticas y estado por una relación separada.',
      evidence:'Originales de la escena anterior, documentos recibidos y configuración aplicada en el periodo de captura.',
      records:[
        {source:'Fuentes y política del caso',detail:'Comprobar Sysmon, Seguridad y el canal de la versión de PowerShell usada. Cuando se capture el evento 4104, contrastar sus bloques de script con proceso, usuario y tiempo; revisar la configuración de registro y la fragmentación. No inferir que toda línea de comandos tenga un 4104 ni que su ausencia demuestre que PowerShell no se usó. Un estado conectado actual no acredita cobertura histórica.'},
        {source:'Identidad de cada evento',detail:'Localizar Sysmon 13, 1 y 11 y Seguridad 4624 por equipo, proveedor, canal, número de registro y hora. El tipo de evento por sí solo no lo identifica.'},
        {source:'Contenido para la investigación',detail:'Contrastar proceso, usuario, identificadores, ruta y entrada de registro cuando correspondan. Verificar cómo se representan los campos del original en Elastic.'},
        {source:'Fechas y conjunto acotado',detail:'Consultar la ventana original del caso y comprobar @timestamp y zona horaria. Distinguir event.ingested si está disponible; revisar faltantes o duplicados en el conjunto definido.'}
      ],
      boundary:'La flecha discontinua de Fleet representa gestión de políticas: Elastic Agent inicia el contacto con Fleet Server. El destino de los eventos del equipo es Elasticsearch. El alumno revisa evidencia y configuración del caso sin modificar la política compartida.',
      action:'Elegir los eventos originales de la escena anterior. En Discover, la vista de búsqueda de Kibana, seleccionar las fuentes y el periodo absoluto del caso; localizar cada documento y contrastar su identidad, contenido y tiempo.',
      questions:['¿Aparece cada original seleccionado en la fuente de datos correcta, sin confundirlo con otro del mismo tipo?','¿Los campos necesarios para reconstruir cambio, sesión, proceso y marcador conservan su significado?','¿El conjunto acotado presenta faltantes o duplicados y qué alcance permite afirmar la comparación?'],
      result:'Una tabla original → documento de Elastic con coincidencias y diferencias. Una muestra permite validar sus eventos; afirmar completitud exige comparar las identidades de todo el conjunto acotado definido, no solo sus cantidades.',
      caption:'Registros → Elastic Agent → Elasticsearch. El alumno comprueba la correspondencia desde Kibana y los originales; Fleet aporta contexto de administración.',
      motion:'Mostrar el recorrido del registro hacia Elasticsearch y, después, el contraste original-documento por el alumno. Resaltar la gestión de políticas por separado y conservar la fecha original.',
      script:'Comparar originales y documentos de Elastic por identidad, campos, tiempo y cobertura dentro de un alcance definido. Distinguir recepción comprobada de estado conectado del agente.',
      nodes:['sensor','collector','fleet','elasticsearch','originals','learner','kibana'], edges:['collection','shipping','policy','search','query','compare']
    },
    {
      name:'Se contrastan los dos avisos', context:'Investigación individual · dos explicaciones que deben contrastarse',
      narrative:[
        'El foco pasa al alumno y a sus dos fuentes de consulta: Kibana y los registros originales. Dos avisos señalan el mismo mecanismo de inicio automático. Uno corresponderá a una actualización autorizada y otro a la persistencia emulada, sin indicar cuál es cuál.',
        'La investigación conectará lo observado en Windows con la procedencia del archivo y el contexto del cambio. Para cada aviso se buscará una explicación legítima y otra sospechosa, comprobando qué evidencia sostiene o contradice cada una. El recorrido puede terminar en un cierre sustentado, un escalamiento o una conclusión pendiente por falta de información.'
      ],
      title:'El mismo mecanismo puede tener usos diferentes',
      description:'Dos avisos señalan cambios de inicio automático. El caso incluirá una actualización autorizada y una persistencia emulada, sin indicar al alumno cuál corresponde a cada aviso. Ambos se investigarán con los mismos criterios.',
      evidence:'Cronologías ya reconstruidas, documentos de Kibana, originales, estado de Run, archivos referenciados e información de inventario y cambios autorizados.',
      records:[
        {source:'Procedencia del programa',detail:'Comparar ruta, metadatos y huella del archivo con el paquete o inventario disponible. Una firma o un nombre parecido a software conocido no bastan.'},
        {source:'Autorización y contexto',detail:'Contrastar cuenta, equipo, horario y alcance con el cambio autorizado. La ausencia de una autorización no prueba por sí sola una intrusión.'},
        {source:'Cadena de actividad y efecto',detail:'Relacionar proceso modificador, entrada Run, programa iniciado y marcador con sus sesiones y tiempos; buscar una explicación alternativa compatible.'},
        {source:'Alcance y calidad de la evidencia',detail:'Buscar actividad relacionada dentro de los datos disponibles y separar hechos confirmados, inferencias y datos pendientes. Un vacío puede impedir el veredicto.'}
      ],
      boundary:'El alumno no recibe etiquetas legítimo/adversario ni el YAML de Caldera. Los avisos son un punto de partida. Esta escena no exige atribución a una APT ni construir reglas del módulo 04.',
      action:'Crear una ficha para cada aviso en Kibana y los originales. Formular una explicación legítima y una sospechosa, reunir evidencia a favor y en contra y decidir qué puede cerrarse o debe escalarse.',
      questions:['¿El archivo, su proceso de instalación y el cambio observado coinciden con una actualización autorizada?','¿Qué combinación de evidencias hace sospechoso el otro cambio y qué explicación alternativa sigue siendo posible?','¿El alcance confirmado se limita a un equipo y una cuenta o hay evidencia de actividad relacionada?'],
      result:'Dos fichas con cronología, evidencias citadas, explicación alternativa, alcance, conclusión y datos pendientes. Las salidas admitidas son actividad legítima sustentada, sospechosa para escalar o información insuficiente, sin forzar una respuesta binaria.',
      caption:'Se comparan evidencias y contexto para cada aviso. El nombre Caldera no es un criterio de resolución.',
      motion:'Mantener el mapa común y destacar, por turno, consulta, contraste con los originales y contexto de cada aviso, sin anticipar la clasificación.',
      script:'Investigar ambos avisos con los mismos criterios: procedencia, autorización, cadena de procesos, ejecución y alcance. Justificar cierre, escalamiento o incertidumbre.',
      nodes:['learner','kibana','elasticsearch','originals'], edges:['search','query','compare']
    },
    {
      name:'La falta de resultados exige comprobación', context:'Variante didáctica de visibilidad · pendiente de preparar',
      narrative:[
        'Aparece una discrepancia en el contraste: un evento de inicio de sesión existe en los originales, pero no se ve en la consulta inicial de Kibana. La línea interrumpida llama la atención sobre esa diferencia; no identifica por sí sola una avería de red.',
        'El alumno revisará primero el periodo, los filtros y las fuentes consultadas; después, la configuración y los registros de recolección. Un conjunto de contraste preparado permitirá comprobar la corrección sin alterar la evidencia compartida. Si la falta de visibilidad afectaba a una conclusión de la escena anterior, esa conclusión deberá revisarse.'
      ],
      title:'¿Falta actividad o falta visibilidad?',
      description:'Se preparará una variante en la que el evento 4624 de la sesión existe en los originales, pero no aparece en la consulta inicial. El alumno deberá averiguar si la discrepancia está en la búsqueda o en la recolección antes de usarla para decidir sobre el aviso.',
      evidence:'El 4624 original, consulta y ventana temporal, fuentes seleccionadas, política aplicada y registros del agente. Un paquete de contraste permitirá verificar la corrección preparada por el instructor.',
      records:[
        {source:'Original y búsqueda reproducible',detail:'Identificar el evento por equipo, proveedor, canal, número y hora; repetir la búsqueda con periodo y zona horaria comprobados.'},
        {source:'Fuentes y filtros',detail:'Comprobar la vista de datos, sus índices, permisos de lectura y filtros. Un evento oculto por la consulta no equivale a uno que no fue recolectado.'},
        {source:'Configuración y estado de captura',detail:'Revisar canal de Seguridad, filtros de entrada y registros de errores o envío correspondientes a ese periodo.'},
        {source:'Contraste después de la corrección',detail:'Comparar el paquete corregido con el mismo original y repetir la consulta. Mantener documentadas la variante y las fechas de carga.'}
      ],
      boundary:'La línea interrumpida señala una discrepancia en el contraste; no anticipa una avería de red. El alumno no cambia la política central ni altera el conjunto de referencia compartido.',
      action:'Probar hipótesis en orden: periodo y filtros; fuentes y acceso; configuración de recolección; errores del agente. Citar qué descarta o sostiene cada una, proponer la corrección y verificarla con el paquete de contraste.',
      questions:['¿El evento falta en los datos o solamente queda fuera de la consulta inicial?','¿Qué evidencia localiza el problema y qué hipótesis se han descartado?','¿La misma búsqueda permite recuperar el evento tras la corrección y qué conclusión de la escena 4 debe revisarse?'],
      result:'Un diagnóstico con evidencia, corrección propuesta y comparación antes/después sobre el mismo evento. Si no puede localizarse la causa, documentar el vacío y sus consecuencias para la investigación.',
      caption:'Un evento ausente de la búsqueda es un problema que debe localizarse; la evidencia original permite comprobar el resultado.',
      motion:'Destacar el original, el resultado ausente y las comprobaciones; mostrar después el contraste corregido sin alterar ni borrar el original.',
      script:'Diagnosticar por qué un 4624 original no aparece en la consulta inicial y comprobar la corrección con un conjunto de contraste conservado.',
      nodes:['sensor','originals','collector','elasticsearch','kibana','learner'], edges:['collection','shipping','search','query','compare'], gap:true
    },
    {
      linux:true, mapTitle:'Práctica Linux: control y verificación', name:'La protección se prueba en un entorno separado', context:'Práctica individual en clase · VM Linux aislada',
      narrative:[
        'El mapa cambia a una práctica operativa separada del caso Windows. En una única máquina virtual Linux se prepararán un servicio HTTP y dos orígenes virtuales de prueba. El alumno aplicará un control de acceso que restrinja uno y mantenga el otro autorizado.',
        'El recorrido tendrá tres estados: antes del control, con el control activo y después de revertirlo. En cada estado se probarán ambos orígenes y se conservarán evidencias del servicio y del cortafuegos. La matriz del diagrama muestra los criterios que deberán comprobarse en el laboratorio; no representa resultados ya obtenidos.'
      ],
      title:'Bloquear un origen sin interrumpir el servicio',
      description:'En la VM Linux aislada se preparará un servicio HTTP y dos orígenes de prueba virtuales. El alumno aplicará una regla de cortafuegos que restrinja uno y permita el otro. Los orígenes se preconfigurarán dentro de la misma VM; no representan dos máquinas adicionales.',
      evidence:'Pruebas de conexión, estado del servicio, regla aplicada, contadores o registros del cortafuegos y accesos HTTP, antes del cambio, con el control activo y tras su reversión.',
      records:[
        {source:'Estado inicial',detail:'Comprobar que ambos orígenes alcanzan el servicio y conservar sus resultados y el estado inicial del cortafuegos.'},
        {source:'Control aplicado',detail:'Probar de nuevo ambos orígenes. Correlacionar el fallo del restringido con la regla y sus contadores o registros; comprobar que el autorizado sigue funcionando.'},
        {source:'Registros Linux',detail:'El cortafuegos puede bloquear antes de llegar a HTTP. La ausencia de un acceso HTTP no demuestra por sí sola el bloqueo ni la caída del servicio.'},
        {source:'Reversión',detail:'Restaurar el estado de la regla y repetir las dos pruebas. Registrar si se recupera el comportamiento inicial, sin darlo por supuesto.'}
      ],
      boundary:'Es un complemento operativo separado del caso Windows. Esta página describe la práctica, no ejecuta reglas ni pruebas. La VM, los orígenes y el procedimiento siguen pendientes de piloto.',
      action:'Guardar el estado inicial; probar ambos orígenes; aplicar el control previsto; repetir las pruebas y contrastar registros; revertir y comprobar de nuevo. Actuar solo en la VM asignada y documentar cada resultado.',
      questions:['¿El origen restringido falló por la regla o por otra causa, como una caída del servicio?','¿El origen autorizado conserva la función legítima durante el bloqueo?','¿La reversión restablece el comportamiento inicial y qué evidencia lo demuestra?'],
      result:'Una matriz de tres estados y dos orígenes con resultados observados y evidencias. Se evalúan bloqueo específico, continuidad legítima y reversión; no se presume éxito si falla alguna comprobación.',
      caption:'Complemento Linux: dos orígenes virtuales en una VM y tres estados de prueba. El caso Windows y sus registros conservan su referencia.',
      motion:'Mostrar los tres estados de la práctica y alternar el origen restringido y el autorizado. Cada resultado deberá representar una comprobación real del laboratorio, nunca una prueba fingida en la página.',
      script:'En una VM Linux, verificar un control de acceso a HTTP con dos orígenes virtuales: probar antes, con la regla aplicada y tras revertirla, conservando evidencias.',
      nodes:[], edges:[]
    }
  ];
  const overview = {
    context:'Vista general del módulo', title:'Del origen de la actividad a la investigación',
    narrative:[
      'El mapa conecta tres zonas: la red adversaria, la red objetivo y la red de Elastic. Caldera origina actividad controlada en Windows; el equipo genera registros y Elastic Agent los envía a Elasticsearch. Fleet administra la recolección y Kibana ofrece la consulta.',
      'El alumno trabaja individualmente con la captura conservada del caso. A lo largo de cinco escenas comprobará ejecución, recolección, interpretación y visibilidad. La sexta mostrará una práctica Linux separada para verificar y revertir un control de protección. Selecciona una escena para seguir el recorrido o un componente para examinar su función.'
    ],
    description:'La red adversaria controla la emulación. El objetivo genera registros y los envía a Elastic. El alumno analiza una copia conservada del caso.',
    evidence:'Registros locales y documentos indexados, con equipo, usuario y marcas de tiempo.',
    boundary:'Topología lógica para revisar la propuesta; no representa una instalación ya desplegada.',
    action:'Investigar una alerta, comparar registros originales e indexados y verificar una medida reversible en la práctica Linux.',
    result:'Un alcance justificado, una comprobación de visibilidad y pruebas del control sin afectar el acceso legítimo.',
    caption:'Caldera origina actividad en el objetivo; Elastic recibe sus registros y el alumno investiga la evidencia conservada.',
    motion:'Cada escena dispone de una secuencia ilustrativa; la vista general permanece estática.'
  };
  const components = {
    caldera:['Servidor Caldera','Orquesta la emulación desde la red adversaria. Intercambia tareas y resultados con su agente.','Informe de operación como referencia de preparación; los efectos se comprueban con evidencia del objetivo.'],
    instructor:['Instructor','Prepara y verifica el caso antes de la investigación del alumno. Conserva la referencia de las acciones y los efectos comprobados.','Registro de preparación y verificación separado de las respuestas del alumno.'],
    'adversary-agent':['Agente Caldera','Está dentro del equipo objetivo y se comunica con el servidor Caldera. Su instalación es un punto de partida asumido del caso.','Actividad local y comunicaciones de instrumentación; no prueba una vía de acceso inicial.'],
    activity:['Actividad en Windows','En el ejemplo propuesto se configurará un inicio automático y se comprobará su ejecución. La misma pieza del mapa representa procesos, archivos y configuración en otras escenas.','Registros del cambio y los procesos, estado de la entrada y archivo, sesión y contexto comparable; el guion previo de Caldera no se entrega al alumno.'],
    sensor:['Sysmon y registros de Windows','Son fuentes locales dentro del equipo. Sysmon no sustituye la auditoría de Seguridad ni la de PowerShell.','Registros originales de las fuentes que se hayan habilitado y verificado.'],
    collector:['Elastic Agent','Lee las fuentes configuradas y envía sus eventos a Elasticsearch. Es independiente del agente Caldera.','Configuración de entradas, estado de recolección y eventos recibidos.'],
    fleet:['Fleet / Fleet Server','Fleet administra políticas; Fleet Server las comunica a los agentes y recibe su estado. Se agrupan aquí para simplificar la vista.','Política y estado del agente. Los eventos recolectados tienen como destino Elasticsearch.'],
    elasticsearch:['Elasticsearch','Almacena e indexa eventos para su consulta. Esta pieza es un servicio lógico, no una asignación a una máquina física concreta.','Documentos indexados y marcas de tiempo, contrastados con los originales.'],
    kibana:['Kibana','Proporciona la interfaz de análisis sobre los datos en Elasticsearch. El alumno acota sus consultas al periodo y al caso.','Búsquedas documentadas, resultados y contexto temporal.'],
    originals:['Registros originales conservados','Copia de referencia del caso obtenida en la preparación. Se pone a disposición del alumno sin alterar la evidencia compartida.','Fuentes originales con fechas y procedencia documentadas; se compara su contenido con el indexado.'],
    learner:['Alumno','Trabaja individualmente desde su puesto, consulta Kibana y contrasta los resultados con los originales y el contexto operativo.','Consultas, evidencias citadas, conclusiones y limitaciones de su investigación.']
  };
  const edges = [
    {id:'emulation',from:'caldera',to:'adversary-agent',type:'control',both:true,label:'Canal del agente: tareas y resultados'},
    {id:'execution',from:'adversary-agent',to:'activity',type:'control',label:'Actividad ejecutada en el objetivo'},
    {id:'local-record',from:'activity',to:'sensor',type:'data',label:'Registro local de la actividad'},
    {id:'collection',from:'sensor',to:'collector',type:'data',label:'Recolección de fuentes locales'},
    {id:'shipping',from:'collector',to:'elasticsearch',type:'data',label:'Envío de eventos a Elasticsearch'},
    {id:'policy',from:'fleet',to:'collector',type:'management',label:'Gestión de la política del agente'},
    {id:'query',from:'kibana',to:'elasticsearch',type:'query',both:true,label:'Consultas y resultados'},
    {id:'search',from:'learner',to:'kibana',type:'query',label:'El alumno investiga en Kibana'},
    {id:'compare',from:'learner',to:'originals',type:'query',label:'Contraste con los registros originales'},
    {id:'instructor-control',from:'instructor',to:'caldera',type:'management',label:'Preparación de la emulación por el instructor'}
  ];
  const motionSequences = [
    {
      runAfter:3, endTitle:'Inicio automático configurado', endDetail:'La entrada Run queda preparada en el ejemplo. Su ejecución posterior se comprueba en la escena 2.',
      steps:[
        {edge:'emulation',reverse:true,nodes:['adversary-agent','caldera'],title:'El agente consulta tareas',detail:'El contacto parte del agente ya instalado en Windows.'},
        {edge:'emulation',nodes:['caldera','adversary-agent'],title:'Caldera responde con una tarea',detail:'El servidor devuelve instrucciones para configurar el inicio automático.'},
        {edge:'execution',nodes:['adversary-agent','activity'],title:'El agente actúa dentro de Windows',detail:'Se representa el cambio local de Run; el programa aún no se muestra arrancando.'},
        {edge:'emulation',reverse:true,nodes:['adversary-agent','caldera'],title:'El agente devuelve el resultado',detail:'El informe de la tarea vuelve a Caldera. No acredita el arranque posterior del programa.'}
      ]
    },
    {
      runAfter:0, type:'data', endTitle:'Configuración → sesión → programa → marcador',
      endDetail:'La secuencia ilustra cuatro hechos distintos. Atribuir el arranque a Run exige contrastar el árbol de procesos y otros posibles lanzadores.',
      endView:{activity:['Secuencia del ejemplo','Configuración, sesión, proceso y efecto','icon-logs']},
      steps:[
        {nodes:['activity','sensor'],record:0,title:'Se modifica la entrada Run',detail:'Sysmon 13 registra el cambio. El proceso modificador es distinto del programa que se iniciará después.',view:{activity:['Cambio de Run','Inicio automático configurado','icon-settings'],sensor:['Sysmon 13','Modificación del registro','icon-logs']}},
        {nodes:['activity','sensor'],record:1,title:'El usuario inicia una nueva sesión',detail:'Seguridad 4624, tipo 2 en este caso: cuenta, equipo, hora e identificador de sesión.',view:{activity:['Nueva sesión','Inicio interactivo del usuario','icon-person'],sensor:['Seguridad 4624','Sesión local · tipo 2','icon-logs']}},
        {nodes:['activity','sensor'],record:2,title:'Se observa la ejecución del programa',detail:'Sysmon 1 aporta proceso, usuario, sesión y árbol. La proximidad al inicio de sesión no prueba por sí sola el mecanismo Run.',view:{activity:['Programa en ejecución','Proceso de prueba iniciado','icon-console'],sensor:['Sysmon 1','Proceso y árbol de ejecución','icon-logs']}},
        {edge:'local-record',nodes:['activity','sensor'],record:3,title:'El programa crea el archivo marcador',detail:'Sysmon 11 se vincula al programa mediante ProcessGuid. El marcador demuestra un efecto acotado, no solo configuración.',view:{activity:['Archivo marcador','Efecto del programa de prueba','icon-logs'],sensor:['Sysmon 11','Archivo y proceso creador','icon-logs']}}
      ]
    },
    {
      type:'data',endTitle:'Original y documento listos para contrastar',endDetail:'Comprobar identidad, campos y fechas. Una muestra no acredita la completitud de todo el conjunto.',
      steps:[
        {edge:'collection',nodes:['sensor','collector'],record:0,title:'Elastic Agent lee las fuentes configuradas',detail:'Sysmon, Seguridad y PowerShell dependen de la configuración y cobertura conservadas.',view:{sensor:['Fuentes de Windows','Sysmon · Seguridad · PowerShell','icon-logs']}},
        {edge:'shipping',nodes:['collector','elasticsearch'],title:'Los registros llegan a Elasticsearch',detail:'Los eventos se procesan e indexan como documentos consultables.'},
        {edge:'search',nodes:['learner','kibana'],title:'El alumno consulta el periodo del caso',detail:'La consulta usa las fechas originales y las fuentes correctas, aunque la captura sea histórica.'},
        {edge:'query',nodes:['kibana','elasticsearch'],title:'Kibana solicita los documentos',detail:'La consulta se dirige a los datos almacenados en Elasticsearch.'},
        {edge:'query',reverse:true,nodes:['elasticsearch','kibana'],record:2,title:'Los documentos se muestran en Kibana',detail:'Se revisan los campos que permiten reconstruir cambio, sesión, proceso y marcador.'},
        {edge:'compare',nodes:['learner','originals'],record:3,title:'El alumno contrasta con los originales',detail:'Se comparan identidades, contenido y fechas, y se documentan faltantes o duplicados en un conjunto acotado.'}
      ]
    },
    {
      type:'query',endTitle:'Cierre, escalamiento o información insuficiente',endDetail:'La animación recorre el razonamiento; no etiqueta de antemano cuál aviso es legítimo o sospechoso.',
      steps:[
        {nodes:['kibana'],title:'Dos avisos permanecen sin clasificar',detail:'Aviso A y aviso B se investigan con los mismos criterios.',view:{kibana:['Dos avisos','Aviso A · Aviso B','icon-search']}},
        {edge:'search',nodes:['learner','kibana'],record:2,title:'Se reconstruye la cadena de actividad',detail:'Comparar cambio de Run, programa, sesión y efecto para cada aviso.'},
        {edge:'compare',nodes:['learner','originals'],record:0,title:'Se contrasta la procedencia del archivo',detail:'Relacionar archivo, huella y metadatos con los originales, el paquete y el inventario disponible.'},
        {nodes:['learner'],record:1,title:'Se contrasta la autorización y el contexto',detail:'Cuenta, equipo, horario y alcance deben ser compatibles con el cambio autorizado; un nombre o una firma no bastan.'},
        {nodes:['learner'],record:3,title:'Se justifica una decisión por aviso',detail:'Citar evidencia a favor y en contra, explicación alternativa, alcance confirmado y datos pendientes.'}
      ]
    },
    {
      type:'query',endTitle:'Comprobaciones de visibilidad recorridas',endDetail:'El diagnóstico y la corrección deben sostenerse con evidencia. Una búsqueda sin resultados no demuestra un fallo de transporte.',
      steps:[
        {nodes:['originals'],record:0,title:'El 4624 existe en los originales',detail:'La identidad y la hora del original permiten buscar el mismo evento, no solo otro del mismo tipo.'},
        {edge:'search',nodes:['learner','kibana'],title:'La consulta inicial no muestra el evento',detail:'Es una discrepancia de visibilidad. No se anima una rotura de red ni se anticipa la causa.',view:{kibana:['Consulta inicial','4624 no visible en la búsqueda','icon-search']}},
        {nodes:['kibana'],record:1,title:'Se revisan periodo, fuentes, filtros y acceso',detail:'Comprobar primero si el evento queda fuera de la búsqueda o de las fuentes consultadas.'},
        {nodes:['collector','fleet'],record:2,title:'Se revisa la captura y el estado del agente',detail:'Consultar política, filtros y errores correspondientes al periodo de captura; sin cambiar la configuración central.'},
        {edge:'compare',nodes:['learner','originals'],record:3,title:'Se verifica la corrección propuesta',detail:'Comparar el mismo evento con el paquete de contraste preparado y revisar las conclusiones que dependían de ese vacío.'}
      ]
    },
    {
      type:'protection',endTitle:'Criterios de bloqueo, continuidad y reversión',endDetail:'Los estados muestran qué se debe comprobar en la VM. No son resultados medidos ni una contención del caso Windows.',
      steps:[
        {nodes:['restricted','authorized','linux-service'],column:1,title:'Estado inicial: probar ambos orígenes',detail:'Criterio esperado: ambos alcanzan HTTP. Conservar las pruebas y el estado inicial.',expectations:{restricted:'allowed',authorized:'allowed'}},
        {nodes:['linux-learner','linux-control'],column:2,title:'Aplicar un control acotado',detail:'El alumno cambia una regla reversible en su VM aislada y conserva el estado anterior.'},
        {nodes:['restricted','linux-control'],column:2,title:'Probar el origen restringido',detail:'Criterio esperado: bloqueo atribuible a la regla, sustentado por pruebas y contadores o registros.',expectations:{restricted:'blocked'}},
        {nodes:['authorized','linux-service'],column:2,title:'Probar la continuidad legítima',detail:'Criterio esperado: el origen autorizado conserva la respuesta funcional del servicio.',expectations:{authorized:'allowed'}},
        {nodes:['linux-control','restricted','authorized'],column:3,title:'Revertir y repetir ambas pruebas',detail:'Criterio esperado: recuperar el acceso inicial para ambos orígenes y documentar cualquier diferencia.',expectations:{restricted:'allowed',authorized:'allowed'}}
      ]
    }
  ];
  const stepNarratives = [
    [
      'El mensaje sale del agente instalado en Windows y llega al servidor Caldera. El agente consulta si hay tareas disponibles; no se está representando una intrusión inicial.',
      'El mensaje recorre ahora la conexión desde Caldera hacia su agente en Windows. Representa la respuesta con una tarea para configurar un inicio automático.',
      'El foco pasa del agente a la actividad local de Windows. Se configura la entrada Run para el programa de prueba; todavía no se muestra su ejecución posterior.',
      'El mensaje vuelve del agente a Caldera con el resultado de la tarea. La marca Run representa la configuración preparada; comprobar el arranque del programa requiere la evidencia de la siguiente escena.'
    ],
    [
      'En Windows se destaca el cambio de Run y el sensor pasa a Sysmon 13. Se representa una modificación del registro que prepara el inicio automático, sin demostrar todavía que el programa se haya ejecutado.',
      'El icono de actividad cambia a una persona que inicia sesión. El sensor muestra Seguridad 4624, tipo 2: la nueva sesión local aporta cuenta, equipo, hora e identificador para la reconstrucción.',
      'El bloque de actividad muestra el programa ejecutándose y el sensor cambia a Sysmon 1. El proceso se relacionará con la sesión y su árbol; la cercanía temporal no basta para atribuir el arranque a Run.',
      'El programa crea el archivo marcador y la conexión conduce a Sysmon 11. Ese archivo es un efecto comprobable: su ProcessGuid permite vincularlo al proceso que lo creó.'
    ],
    [
      'La tarjeta muestra Sysmon, Seguridad y PowerShell; el mensaje baja hacia Elastic Agent. El alumno comprueba qué canales y registro de scripts se habilitaron. Un 4104 disponible aporta bloques de script; su ausencia no demuestra que PowerShell no se usó.',
      'El mensaje sale de Elastic Agent y llega a Elasticsearch. Es el recorrido de los eventos que se almacenan e indexan; Fleet no aparece como un salto intermedio de esos datos.',
      'Se ilumina la conexión del alumno con Kibana. El alumno prepara una consulta sobre el periodo original y las fuentes del caso conservado.',
      'El mensaje sube desde Kibana hasta Elasticsearch. La interfaz solicita los documentos que corresponden a la búsqueda del alumno.',
      'El mensaje vuelve desde Elasticsearch hacia Kibana. Se muestran documentos cuyos campos permiten reconstruir cambio, sesión, proceso y marcador.',
      'El recorrido conecta al alumno con los originales conservados. Se contrastan identidad, contenido y fechas; la coincidencia de una muestra no demuestra la completitud de todos los datos.'
    ],
    [
      'Kibana muestra dos avisos, A y B, todavía sin clasificar. Ambos señalan un inicio automático y se investigarán con los mismos criterios.',
      'La conexión del alumno con Kibana centra la investigación en la cadena de actividad: cambio de Run, sesión, proceso y efecto para cada aviso.',
      'La conexión pasa a los originales. El alumno contrasta la procedencia del programa con archivos, huellas, metadatos, paquetes e inventario disponibles.',
      'El foco queda en el alumno: debe relacionar cuenta, equipo, horario y alcance con el cambio autorizado. El nombre del programa o su firma no deciden por sí solos la clasificación.',
      'El alumno reúne lo observado para justificar una decisión por aviso. Puede cerrar con sustento, escalar la sospecha o documentar información insuficiente; el diagrama no revela una respuesta predeterminada.'
    ],
    [
      'Se destacan los originales porque allí existe el evento 4624 investigado. Su identidad y su hora sirven de referencia para encontrar el mismo evento en Elastic.',
      'La conexión del alumno llega a Kibana, donde la consulta inicial no muestra el 4624. Esa ausencia plantea una discrepancia de visibilidad, sin afirmar que exista una avería de red.',
      'El foco permanece en Kibana mientras se comprueban periodo, fuentes, filtros y permisos de lectura. El evento podría quedar fuera de la búsqueda aunque se haya recolectado.',
      'Se destacan Elastic Agent y Fleet para revisar la política y los registros de captura. El alumno comprueba filtros y errores del periodo sin modificar la configuración central.',
      'El alumno vuelve al contraste con los originales para verificar la corrección propuesta sobre el mismo evento. También debe revisar cualquier conclusión que dependiera del vacío detectado.'
    ],
    [
      'En la práctica Linux se destacan los dos orígenes y el servicio; la matriz señala el estado inicial. El criterio es comprobar acceso desde ambos y conservar las pruebas de referencia.',
      'El foco pasa al alumno y al control de acceso. Se representa la aplicación de una regla reversible dentro de la VM aislada, conservando el estado anterior.',
      'El origen restringido se marca junto al control y la columna de control activo. El bloqueo es un criterio que deberá demostrarse con conexiones y contadores o registros de la regla.',
      'Se destacan el origen autorizado y el servicio. El alumno deberá comprobar que el servicio sigue respondiendo a la función legítima mientras el otro origen está restringido.',
      'La matriz pasa a Revertido y vuelven a señalarse ambos orígenes. El criterio es recuperar el acceso inicial tras retirar el control y documentar cualquier diferencia; no se presentan resultados medidos.'
    ]
  ];
  window.BlueTeamModule = {meta:{mapTitle:'Red adversaria ↔ red objetivo → red de Elastic'},scenes,overview,components,edges,motionSequences,stepNarratives};
})();
