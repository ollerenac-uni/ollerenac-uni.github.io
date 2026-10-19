(() => {
  'use strict';
  const scenes = [
    {
      name:'Servicios y dependencias', context:'Preparación · contexto operativo del caso',
      title:'El equipo tiene una función dentro del servicio',
      narrative:['El puesto Windows se utiliza para acceder a documentos compartidos. Ese servicio depende de la identidad de los usuarios y de sus permisos. El alumno recibe una ficha de activos, dependencias y responsables antes de valorar los avisos.'],
      description:'El instructor prepara el inventario del caso: servicio de archivos, identidad y puesto Windows. Las conexiones de dependencia explican qué podría verse afectado por una medida defensiva.',
      evidence:'Inventario y ficha del servicio con fecha y procedencia.',
      records:[{source:'Ficha del servicio',detail:'Uso del servicio, usuarios afectados, horario necesario y responsable que puede confirmar su importancia.'},{source:'Inventario y dependencias',detail:'Relación entre puesto, servicio de archivos e identidad. El mapa simplifica las dependencias; no documenta toda la arquitectura.'}],
      boundary:'Se identifican dependencias para decidir con contexto. No se prueba todavía una interrupción ni un compromiso del servicio.',
      action:'Relacionar el puesto observado con el servicio que utiliza. Identificar qué debe seguir funcionando y a quién consultar si hay dudas.',
      questions:['¿Qué función cumple este equipo y quién depende de ella?','¿Qué impacto tendría restringirlo?','¿Qué dato del inventario necesita confirmación?'],
      result:'Una ficha breve de activos, dependencias, criticidad y responsables, con las incertidumbres señaladas.',
      caption:'Primero se entiende el servicio y sus dependencias; la criticidad requiere contexto operativo.',
      nodes:['identity','service','endpoint','context','learner'],edges:['identity-service','usage','compare']
    },
    {
      name:'Avisos iniciales', context:'Entrada del caso · dos avisos didácticos sin clasificar',
      title:'Un aviso abre una pregunta, todavía no una conclusión',
      narrative:['La emulación controlada y una actividad de administración proporcionarán registros para preparar dos avisos de inicio automático en Windows. El alumno recibe A y B sin comandos de Caldera ni etiquetas de legítimo o sospechoso.'],
      description:'Se representa el origen de actividad en el objetivo, su registro y la consulta de los avisos preparados. Un evento registra un hecho; una alerta señala algo a revisar; declarar un incidente exige valoración y contexto.',
      evidence:'Avisos A y B, referencias a sus registros y periodo original del caso.',
      records:[{source:'Ficha de aviso A y ficha de aviso B',detail:'Identificador, equipo, cuenta, hora y zona horaria, fuente y motivo del aviso. No incluyen una clasificación resuelta.'},{source:'Referencias en Kibana',detail:'Vínculos o identificadores que permitan volver a los registros del caso conservado. Los avisos son material didáctico: la recolección por sí sola no crea una alerta.'}],
      boundary:'La animación es una explicación de preparación. El agente Caldera ya estará instalado; no se presenta como una prueba de acceso inicial. No se ejecuta una campaña desde esta web.',
      action:'Leer los dos avisos, localizar sus fuentes y separar lo observado de las explicaciones posibles, sin declarar todavía que hay intrusión.',
      questions:['¿Qué hecho se registró y qué parte es interpretación?','¿Cuándo ocurrió y de qué equipo procede?','¿Qué información falta para tratarlo como incidente?'],
      result:'Dos entradas de aviso con su procedencia, hechos iniciales y preguntas pendientes.',
      caption:'Actividad → registros conservados → avisos que se deben valorar. No se revela su clasificación.',
      nodes:['caldera','endpoint','telemetry','elasticsearch','kibana','learner'],edges:['emulation','local-record','shipping','query','search']
    },
    {
      name:'Prioridad', context:'Triaje · valoración inicial y revisable',
      title:'La prioridad se justifica con impacto y evidencia',
      narrative:['El alumno combina los avisos con la función del equipo, los servicios relacionados y la información disponible. Propone qué atender primero y qué dato podría hacerle cambiar esa prioridad.'],
      description:'El caso presenta dos avisos sin resolver y una ficha de servicio. La valoración cruza impacto potencial, alcance conocido, señales de actividad y confianza en la información. La severidad de un aviso no sustituye esa decisión.',
      evidence:'Ficha de priorización con referencias a avisos e inventario.',
      records:[{source:'Contexto de activos',detail:'Servicio relacionado, usuarios o función afectados y dependencias. Deben citarse datos proporcionados, no suponer criticidad por el nombre del servidor.'},{source:'Información del aviso',detail:'Equipo, cuenta, momento, alcance observado y señales disponibles. Distinguir ausencia de datos de ausencia de actividad.'}],
      boundary:'La prioridad es provisional y distinta de la clasificación. Un aviso puede requerir atención rápida sin que la intrusión esté confirmada.',
      action:'Proponer una prioridad para cada aviso y el orden de atención. Justificarlo con dos datos del caso y señalar un dato que podría modificar la decisión.',
      questions:['¿Qué consecuencia preocupa y en qué dato se apoya?','¿Hay indicios de actividad actual o solo registros históricos?','¿Qué falta confirmar antes de ampliar el alcance?'],
      result:'Una prioridad argumentada por aviso, un orden de atención y un criterio explícito de revisión.',
      caption:'Impacto, alcance y calidad de la información sustentan una prioridad revisable.',
      nodes:['kibana','learner','context','service','casefile'],edges:['search','compare','case-save']
    },
    {
      name:'Autorizaciones', context:'Preparación de la investigación · límites de actuación',
      title:'Consultar contexto y saber qué se puede hacer',
      narrative:['El alumno contrasta cuenta, equipo y horario con el registro de cambios autorizado. A continuación identifica qué consultas están permitidas y quién debe autorizar una acción que pueda afectar al servicio.'],
      description:'Se aporta un registro de cambios con alcance, ventana, cuenta y responsable, además de una matriz sencilla de permisos de actuación. El alumno identifica coincidencias, diferencias e información insuficiente.',
      evidence:'Registro de cambios y matriz de autorizaciones incluidos en el caso.',
      records:[{source:'Cambio autorizado',detail:'Identificador, responsable, equipo o servicio, cuenta prevista, ventana temporal y acción aprobada. Una coincidencia parcial no explica por sí sola toda la actividad.'},{source:'Permisos de actuación',detail:'Lectura y conservación de datos permitidas; responsable que autoriza aislar, detener o modificar un activo y condiciones para revertir la acción.'}],
      boundary:'La falta de un cambio registrado no demuestra una intrusión. No se aísla ni se modifica la infraestructura compartida en esta práctica.',
      action:'Contrastar los avisos con el cambio, registrar lo que coincide y lo que falta, y señalar la autorización necesaria antes de una medida con impacto.',
      questions:['¿Coinciden alcance, equipo, cuenta y ventana?','¿Qué comprobación puede realizar el analista por sí mismo?','¿Quién autorizaría una acción que interrumpa el servicio?'],
      result:'Una comprobación documentada del cambio y una lista breve de acciones permitidas y acciones que requieren autorización.',
      caption:'El cambio da contexto; la matriz de actuación limita las medidas que pueden afectar al servicio.',
      nodes:['context','learner','casefile','service'],edges:['compare','case-save']
    },
    {
      name:'Coordinación', context:'Roles, escalamiento y comunicación',
      title:'Cada solicitud llega al responsable adecuado',
      narrative:['El alumno representa al analista. Una ficha identifica al responsable del servicio y otra a quien coordina incidentes. El analista pide el contexto que falta y prepara un escalamiento breve cuando el impacto o la incertidumbre lo justifican.'],
      description:'El mapa sustituye temporalmente la ficha de contexto por los roles de servicio y coordinación. Es un intercambio simulado sobre documentos del caso; no son mensajes enviados a personas reales.',
      evidence:'Directorio de roles, criterio de escalamiento y borrador de comunicación.',
      records:[{source:'Roles del caso',detail:'El analista documenta y consulta; el responsable del servicio confirma necesidades y cambios; la coordinación reúne decisiones y autorizaciones conforme a la matriz.'},{source:'Borrador de escalamiento',detail:'Qué se observó, activos implicados, impacto posible, prioridad provisional, evidencia citada, incertidumbre y decisión o información que se solicita.'}],
      boundary:'Escalar no significa confirmar una intrusión ni autorizar automáticamente una contención. Este módulo prepara la coordinación; la respuesta completa se desarrolla después.',
      action:'Elegir a quién solicitar información y redactar un mensaje breve que permita tomar una decisión sin leer todos los registros.',
      questions:['¿Quién puede confirmar el cambio y la necesidad del servicio?','¿Qué condición justifica escalar?','¿Qué decisión concreta se solicita y con qué evidencia?'],
      result:'Una asignación de responsabilidades y un borrador de escalamiento con hechos, límites y solicitud concreta.',
      caption:'Analista → responsable del servicio → coordinación, según la información o decisión requerida.',
      nodes:['learner','context','casefile'],edges:['compare','case-save']
    },
    {
      name:'Expediente', context:'Entrega individual · continuidad durante el curso',
      title:'El expediente conserva lo sabido y lo pendiente',
      narrative:['Cada alumno abre su expediente con los avisos, los activos relacionados y su valoración inicial. Guarda referencias a las fuentes, decisiones, responsables y preguntas pendientes, sin copiar todo el conjunto de registros.'],
      description:'La ficha reúne el trabajo de las cinco escenas anteriores. Se registra la situación inicial y las próximas comprobaciones para que las investigaciones de los siguientes módulos puedan continuar sobre la misma base.',
      evidence:'Expediente individual inicial, con referencias verificables y procedencia.',
      records:[{source:'Identificación y cronología inicial',detail:'Identificador de expediente, analista, avisos, activos y periodo con zona horaria. Separar la fecha de análisis de las fechas originales del caso.'},{source:'Hechos y decisiones',detail:'Referencias a fuentes, observaciones, hipótesis diferenciadas, prioridad y motivo, permisos y responsables, escalamiento y próximos pasos.'}],
      boundary:'La entrega se evalúa por la trazabilidad y la justificación, no por adivinar el comando emulado ni cerrar prematuramente el incidente. La web ilustra la ficha; no guarda un expediente real.',
      action:'Abrir el expediente individual y dejar una valoración que otro analista pueda continuar, citando las fuentes y evitando conclusiones que los datos aún no sostienen.',
      questions:['¿Se puede volver desde cada afirmación a su fuente?','¿Se distinguen hechos, hipótesis y datos pendientes?','¿Está claro qué comprobar después y quién debe decidir?'],
      result:'Un expediente inicial trazable, con prioridades revisables, responsabilidades y próximas acciones. Se reutiliza durante el curso.',
      caption:'El resultado del módulo es un expediente inicial individual, preparado para continuar la investigación.',
      nodes:['learner','context','casefile','kibana'],edges:['search','compare','case-save']
    }
  ];
  const overview = {
    context:'Vista general · módulo 01 · 3 horas',title:'Preparar la investigación antes de actuar',
    narrative:['El recorrido comienza por el servicio y sus dependencias. Presenta dos avisos sin clasificar, una valoración de prioridad y la comprobación de cambios y permisos. Después sitúa los roles de coordinación y reúne las decisiones en un expediente individual.',
      'La red adversaria, la red objetivo y Elastic mantienen el contexto de la campaña común. Las tarjetas inferiores representan documentos y trabajo del analista: no son más servidores. El mapa explica una práctica propuesta, pendiente de preparar y validar.'],
    description:'Se organiza la entrada del caso: activos, avisos, prioridades, autorizaciones, coordinación y expediente.',
    evidence:'Fichas del servicio, avisos con referencias, cambios autorizados, roles y expediente inicial.',
    boundary:'Basado en el módulo 01 de modelo-temario.docx. La web no genera eventos, envía mensajes ni realiza acciones sobre el laboratorio.',
    action:'Valorar avisos con información de activos y cambios autorizados, justificar prioridades y abrir el expediente individual que se utilizará durante el curso.',
    result:'Una valoración inicial trazable con prioridades, responsabilidades, autorizaciones y preguntas pendientes.',
    caption:'Preparación operativa: servicios → avisos → prioridad → autorizaciones → coordinación → expediente.'
  };
  const components = {
    caldera:['Servidor Caldera','Orquesta actividad controlada mediante un agente ya instalado en el objetivo. Representa el origen de parte de los registros del caso.','Su guion y las respuestas de referencia se reservan a la preparación docente; el alumno recibe avisos y fuentes sin la solución.'],
    instructor:['Instructor','Prepara y valida el caso, el contexto de activos, los cambios y los roles, antes de entregarlo.','Material de preparación separado del expediente del alumno. La página no acredita que el piloto ya se haya realizado.'],
    identity:['Identidad / Active Directory','Servicio que autentica usuarios y participa en sus permisos de acceso. Es una dependencia del servicio de documentos en este ejemplo.','Ficha de dependencia y responsable. Este módulo no investiga ataques a Active Directory.'],
    service:['Servicio de archivos','Permite trabajar con documentos compartidos. Su función, usuarios y horario ayudan a valorar el impacto de una incidencia o de una medida defensiva.','Ficha de servicio e inventario con responsable y criticidad justificada.'],
    endpoint:['Puesto Windows','Equipo desde el que se accede a los documentos. Contendrá el agente de emulación preinstalado y la instrumentación de registros del caso.','Dos avisos de inicio automático y referencias a sus fuentes, sin revelar la clasificación.'],
    telemetry:['Registros y Elastic Agent','Agrupa las fuentes locales y su recolector para mantener esta vista general. Elastic Agent envía los eventos a Elasticsearch. El módulo 03 separa estas piezas.','Fuentes originales e indexadas con procedencia. Que existan registros no implica que se haya generado una alerta automáticamente.'],
    fleet:['Fleet / Fleet Server','Administran las políticas y el estado de los agentes de recolección. Se agrupan para simplificar el diagrama.','Configuración de captura como contexto. Los eventos se envían a Elasticsearch, no pasan por Fleet Server.'],
    elasticsearch:['Elasticsearch','Almacena e indexa los registros del caso conservado. Es un servicio lógico, no una asignación a un equipo físico.','Documentos con equipo, cuenta y marcas de tiempo originales.'],
    kibana:['Kibana','Interfaz para consultar la información indexada. En este módulo permite localizar el contexto inicial de los avisos.','Referencias a las fuentes; la investigación técnica detallada se realiza en módulos posteriores.'],
    context:['Contexto y coordinación','Tarjeta de documentos y roles: inventario, criticidad, cambios, permisos de actuación y responsables. Sus etiquetas cambian para mostrar el documento o rol consultado.','Fichas preparadas para la práctica. Las conexiones representan consultas y coordinación simuladas, no tráfico de red.'],
    casefile:['Expediente individual','Documento de trabajo que conserva avisos, referencias a evidencia, prioridades, decisiones y preguntas pendientes del alumno.','Plantilla que se completará en el laboratorio. La visualización no guarda datos ni reemplaza ese documento.'],
    learner:['Alumno / analista','Trabaja individualmente desde su puesto y aplica criterios de preparación y valoración inicial.','Se evalúa la trazabilidad y la justificación de sus decisiones; no conocer el guion de Caldera.']
  };
  const edges = [
    {id:'instructor-control',from:'instructor',to:'caldera',type:'management',label:'Preparación del caso por el instructor'},
    {id:'emulation',from:'caldera',to:'endpoint',type:'control',both:true,label:'Canal lógico con el agente preinstalado del puesto'},
    {id:'identity-service',from:'identity',to:'service',type:'management',label:'Dependencia del servicio respecto a la identidad'},
    {id:'usage',from:'endpoint',to:'service',type:'query',label:'Uso del servicio desde el puesto'},
    {id:'local-record',from:'endpoint',to:'telemetry',type:'data',label:'Actividad registrada en el objetivo'},
    {id:'shipping',from:'telemetry',to:'elasticsearch',type:'data',label:'Eventos enviados a Elasticsearch'},
    {id:'policy',from:'fleet',to:'telemetry',type:'management',label:'Política de recolección'},
    {id:'query',from:'kibana',to:'elasticsearch',type:'query',both:true,label:'Consultas y resultados'},
    {id:'search',from:'learner',to:'kibana',type:'query',label:'Consulta del analista en Kibana'},
    {id:'compare',from:'learner',to:'context',type:'query',route:'under',label:'Consulta de contexto y coordinación; relación de trabajo, no tráfico'},
    {id:'case-save',from:'learner',to:'casefile',type:'query',route:'horizontal',label:'Documentación en el expediente individual'}
  ];
  const v=(label,detail,icon='icon-logs')=>[label,detail,icon];
  const motionSequences = [
    {type:'query',endTitle:'Servicio y dependencias identificados',endDetail:'La ficha deja trazadas función, dependencias, responsable y dudas que deben confirmarse.',steps:[
      {nodes:['service'],title:'Identificar el servicio',view:{service:v('Servicio de archivos','Documentos compartidos','icon-service')}},
      {edge:'identity-service',nodes:['identity','service'],title:'Reconocer la dependencia de identidad'},
      {edge:'usage',nodes:['endpoint','service'],title:'Relacionar el puesto con su función'},
      {edge:'compare',nodes:['learner','context'],title:'Consultar criticidad y responsables',view:{context:v('Ficha del servicio','Función, impacto y responsable')}}
    ]},
    {type:'data',endTitle:'Dos avisos pendientes de valoración',endDetail:'Se conservan fuentes y preguntas. El origen controlado del caso no se entrega como solución al alumno.',steps:[
      {edge:'emulation',nodes:['caldera','endpoint'],title:'El caso incluye actividad controlada'},
      {edge:'local-record',nodes:['endpoint','telemetry'],title:'La actividad deja registros'},
      {edge:'shipping',nodes:['telemetry','elasticsearch'],title:'Los registros se indexan'},
      {edge:'search',nodes:['learner','kibana'],title:'Se presentan los avisos A y B',view:{kibana:v('Avisos A y B','Sin clasificación resuelta','icon-search')}}
    ]},
    {type:'query',endTitle:'Prioridad provisional documentada',endDetail:'La decisión explica qué se atiende primero, con qué evidencia y qué información puede cambiarla.',steps:[
      {edge:'search',nodes:['learner','kibana'],title:'Revisar lo que dicen los avisos',view:{kibana:v('Avisos A y B','Hechos y alcance inicial','icon-search')}},
      {edge:'compare',nodes:['learner','context'],title:'Contrastar impacto y dependencias',view:{context:v('Impacto y alcance','Servicio, usuarios y función','icon-service')}},
      {nodes:['learner'],title:'Valorar incertidumbre y urgencia',view:{learner:v('Alumno / analista','Justifica el orden de atención','icon-person')}},
      {edge:'case-save',nodes:['learner','casefile'],title:'Registrar una prioridad revisable',view:{casefile:v('Prioridad provisional','Motivo y criterio de revisión','icon-archive')}}
    ]},
    {type:'query',endTitle:'Contexto y límites de actuación documentados',endDetail:'Quedan registradas las coincidencias del cambio y la autoridad necesaria antes de una acción con impacto.',steps:[
      {edge:'compare',nodes:['learner','context'],title:'Consultar el cambio autorizado',view:{context:v('Cambio autorizado','Alcance, cuenta y ventana','icon-settings')}},
      {nodes:['learner','context'],title:'Contrastar coincidencias y diferencias',view:{context:v('Contraste del cambio','Coincide, difiere o falta')}} ,
      {edge:'compare',nodes:['learner','context'],title:'Comprobar los permisos de actuación',view:{context:v('Permisos de actuación','Quién consulta y quién autoriza','icon-shield')}},
      {edge:'case-save',nodes:['learner','casefile'],title:'Dejar constancia de los límites',view:{casefile:v('Límites de actuación','Permisos y dudas pendientes','icon-archive')}}
    ]},
    {type:'query',endTitle:'Responsable y solicitud de escalamiento definidos',endDetail:'El borrador explica lo observado y pide una decisión concreta sin presentar la sospecha como un hecho confirmado.',steps:[
      {nodes:['learner'],title:'El analista reúne los hechos',view:{learner:v('Analista','Hechos, fuentes e incertidumbre','icon-person')}},
      {edge:'compare',nodes:['learner','context'],title:'Consultar al responsable del servicio',view:{context:v('Responsable del servicio','Confirma función y cambios','icon-person')}},
      {edge:'compare',nodes:['learner','context'],title:'Identificar a quién escalar',view:{context:v('Coordinación de incidentes','Decisiones y autorizaciones','icon-person')}},
      {edge:'case-save',nodes:['learner','casefile'],title:'Preparar una comunicación breve',view:{casefile:v('Borrador de escalamiento','Hechos, impacto y solicitud','icon-logs')}}
    ]},
    {type:'query',endTitle:'Expediente inicial listo para continuar',endDetail:'El expediente conserva fuentes, prioridades, responsables y próximos pasos. La investigación técnica continuará durante el curso.',endView:{casefile:v('Expediente inicial','Preparado para continuar','icon-archive')},steps:[
      {edge:'case-save',nodes:['learner','casefile'],title:'Abrir el expediente individual',view:{casefile:v('Expediente individual','Identificador, analista y fechas','icon-archive')}},
      {edge:'search',nodes:['learner','kibana'],title:'Conservar las referencias a fuentes'},
      {edge:'compare',nodes:['learner','context'],title:'Reunir prioridades, roles y permisos',view:{context:v('Contexto contrastado','Prioridad, permisos y roles','icon-check')}},
      {edge:'case-save',nodes:['learner','casefile'],title:'Anotar las próximas comprobaciones',view:{casefile:v('Hechos y pendientes','Fuentes, decisiones y preguntas','icon-archive')}}
    ]}
  ];
  const stepNarratives = [
    [
      'Se destaca el servicio de archivos: permite a los usuarios trabajar con documentos compartidos. Antes de valorar avisos, el alumno consulta para qué sirve, quién lo utiliza y cuándo debe estar disponible.',
      'La conexión entre identidad y archivos muestra una dependencia del ejemplo: el acceso a documentos requiere autenticar usuarios y comprobar permisos. Una medida sobre identidad puede tener un alcance mayor que un único equipo.',
      'La conexión sube del puesto Windows al servicio de archivos. El puesto tiene una función dentro de ese servicio; su importancia se determina con el inventario y el uso real, no solo por ser una estación de trabajo.',
      'El recorrido une al alumno con la ficha del servicio, situada bajo la red. Allí consulta criticidad, dependencias y responsable, y anota qué información necesita confirmar. La tarjeta representa un documento, no otro servidor.'
    ],
    [
      'Caldera se conecta lógicamente con su agente preinstalado en el puesto Windows para preparar actividad del caso. También habrá actividad de administración comparable. El alumno no recibe las instrucciones de emulación ni una etiqueta que resuelva los avisos.',
      'La actividad del puesto llega al bloque de registros y Elastic Agent. Aquí se agrupan las fuentes locales y el recolector para explicar el recorrido general; los detalles de telemetría se estudiarán en el módulo 03.',
      'El mensaje azul llega a Elasticsearch, donde se conservarán los registros para el análisis. Fleet gestiona la política del agente; no es un salto intermedio del envío de eventos.',
      'El alumno accede por Kibana a las referencias de dos avisos preparados, A y B. Revisa equipo, cuenta, hora, fuente y motivo, separando el hecho registrado de la interpretación. La recogida de datos por sí sola no produce estos avisos didácticos.'
    ],
    [
      'La consulta del alumno llega a los avisos A y B. Primero identifica lo observado, su momento y su alcance conocido; todavía no dispone de una clasificación resuelta.',
      'La conexión pasa a la ficha de impacto y alcance. El alumno cruza los avisos con la función del puesto, el servicio de documentos y sus usuarios para explicar qué consecuencia potencial requiere atención.',
      'El foco queda en el analista. Debe proponer un orden de atención considerando impacto, indicios de actividad e incertidumbre, y reconocer los datos que aún faltan. Prioridad y confirmación de intrusión son decisiones distintas.',
      'El mensaje llega al expediente: se anota una prioridad provisional por aviso, los datos que la justifican y el criterio que permitiría revisarla al obtener nueva evidencia.'
    ],
    [
      'La tarjeta inferior muestra el cambio autorizado. El alumno consulta su alcance, cuenta, responsable y ventana temporal antes de comparar el aviso con la actividad administrativa prevista.',
      'Se destacan el alumno y el registro de cambio. Contrasta equipo, cuenta, horario y alcance; separa coincidencias, diferencias y datos ausentes. Ni una coincidencia parcial ni un cambio no encontrado resuelven por sí solos el aviso.',
      'La tarjeta cambia a permisos de actuación. Se identifica qué lectura y conservación de datos permite la práctica y quién debe autorizar una medida que pueda interrumpir el servicio. No se representa una contención ejecutada.',
      'El recorrido llega al expediente para registrar el contraste del cambio, las dudas y los límites de actuación. El alumno deja claro qué puede comprobar ahora y qué necesita autorización.'
    ],
    [
      'El icono del alumno representa al analista. Reúne hechos, referencias e incertidumbres para formular una solicitud que otra persona pueda comprender sin repetir toda la investigación.',
      'La conexión llega a la tarjeta del responsable del servicio. A este rol se le pide confirmar la necesidad operativa o el alcance de un cambio; la animación representa una coordinación simulada, sin enviar mensajes reales.',
      'La tarjeta pasa a coordinación de incidentes. El alumno identifica a quién elevar el caso cuando el impacto, las señales o la incertidumbre justifican una decisión superior, según los criterios entregados.',
      'El borrador de escalamiento se incorpora al expediente. Resume qué se observó, qué podría estar afectado, qué falta saber y qué decisión o información se solicita; no afirma que exista una intrusión confirmada.'
    ],
    [
      'El alumno abre su expediente individual. Identifica el caso y el analista, y distingue la fecha de su análisis del periodo original de los registros conservados, incluyendo la zona horaria.',
      'La conexión con Kibana recuerda que cada observación debe apuntar a su fuente. El expediente guarda referencias verificables a los avisos y registros, en lugar de copiar indiscriminadamente todos los datos.',
      'El alumno vuelve al contexto contrastado para reunir la prioridad provisional, los responsables y las autorizaciones. Señala por separado los hechos comprobados, las hipótesis y la información pendiente.',
      'El último recorrido llega al expediente con las próximas comprobaciones y las preguntas por resolver. Este documento permite continuar durante el curso; aquí no se cierra el incidente ni se exige adivinar comandos de Caldera.'
    ]
  ];
  window.BlueTeamModule = {meta:{mapTitle:'Red adversaria ↔ red objetivo → red de Elastic'},scenes,overview,components,edges,motionSequences,stepNarratives};
})();
