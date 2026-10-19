(() => {
  'use strict';
  const scenes=[
    {
      name:'Hipótesis',context:'Continuidad del módulo 03 · comportamiento a detectar',title:'Definir el comportamiento antes de escribir la consulta',
      narrative:['El alumno toma como punto de partida un cambio de inicio automático Run que referencia un programa en una ruta que el contexto del caso confirma como modificable por un usuario. Formula qué datos permitirían detectarlo sin conocer el nombre del archivo ni los comandos de Caldera.'],
      description:'El instructor preparará actividad adversaria emulada y actividad legítima comparable. El alumno define una hipótesis limitada a cambios Run y distingue la señal observable de la conclusión de intrusión.',
      evidence:'Hipótesis escrita, referencias a eventos del caso y requisitos de observación.',
      records:[{source:'Comportamiento propuesto',detail:'Modificación de un valor Run que apunta a un programa en una ubicación confirmada como modificable por el usuario. La consulta inicial buscará candidatos; el contexto permitirá interpretar sus usos.'},{source:'Actividad de contraste',detail:'Inicio automático legítimo de una aplicación instalada por usuario, además de casos adversarios. Compartir mecanismo o ruta no convierte toda la actividad en maliciosa.'}],
      boundary:'Se detecta una señal de comportamiento para investigar, no una prueba automática de intrusión o de ejecución posterior. No se utilizan nombres de archivo exclusivos de Caldera como condición decisiva.',
      action:'Escribir qué comportamiento se quiere observar, qué fuentes necesita y qué casos deberían o no deberían producir coincidencias según el alcance elegido.',
      questions:['¿Qué conducta permanece aunque cambie el nombre del programa?','¿Qué actividad legítima comparte esa señal?','¿Qué no pretende cubrir esta detección?'],
      result:'Una hipótesis comprobable con fuente, alcance y criterios iniciales de prueba.',
      caption:'Comportamiento + datos necesarios + actividad legítima comparable → hipótesis comprobable.',
      nodes:['caldera','activity','sensor','tests','learner'],edges:['execution','local-record','compare']
    },
    {
      name:'Campos y período',context:'Datos del caso · correspondencia y tiempo original',title:'Traducir el evento a los campos realmente disponibles',
      narrative:['Antes de escribir condiciones, el alumno compara un evento original con su documento indexado. Comprueba proveedor, tipo de evento, objeto de registro, datos del valor y proceso modificador, además del periodo original que debe consultar.'],
      description:'Se sigue el evento desde Sysmon y Elastic Agent hasta Elasticsearch. El alumno registra la correspondencia entre el original y los campos de su instalación, sus tipos y los valores ausentes. Después fija un periodo absoluto de prueba.',
      evidence:'Evento original, documento indexado, tabla de campos y periodo con zona horaria.',
      records:[{source:'Evento y campos indexados',detail:'Sysmon 13 para el cambio del valor, proveedor y canal, equipo, ruta de registro, datos escritos y proceso modificador. Verificar campos normalizados o winlog.event_data realmente presentes; no presuponer un esquema idéntico en todas las capturas.'},{source:'Periodo de prueba',detail:'Inicio, fin y zona horaria sobre las fechas originales. Comprobar el campo temporal usado por la consulta o regla y distinguir hora del evento de hora de ingesta cuando esté disponible.'}],
      boundary:'Un tipo de evento sin proveedor no identifica la fuente. Un campo ausente o mal interpretado puede causar omisiones; una consulta vacía sobre el periodo equivocado no demuestra que el caso no existió.',
      action:'Construir una tabla de campos con ejemplos del dato original e indexado y fijar el periodo absoluto que contiene los casos de prueba.',
      questions:['¿Qué campos contienen ruta Run, dato escrito y proceso?','¿El dato es texto, lista u otro tipo?','¿Se está buscando por la hora y zona correctas?'],
      result:'Una tabla de correspondencia verificada y un periodo de prueba explícito.',
      caption:'Original → recolección → documento indexado → campos y fechas comprobados.',
      nodes:['sensor','collector','elasticsearch','kibana','tests','learner'],edges:['collection','shipping','query','compare']
    },
    {
      name:'Consulta y regla',context:'Construcción individual · espacio personal de Kibana',title:'Convertir la hipótesis en una detección revisable',
      narrative:['En su espacio personal de Kibana, el alumno construye una consulta de comportamiento usando los campos verificados. La convierte en una regla de consulta personalizada y prueba su lógica sobre el periodo conservado, sin alterar los datos compartidos.'],
      description:'Se configuran fuentes, condiciones, periodo de validación y parámetros temporales de la regla. Se contrasta la consulta directa con la previsualización histórica antes de considerar la detección lista para ejecutar.',
      evidence:'Consulta y versión inicial de la regla, fuentes y parámetros temporales registrados.',
      records:[{source:'Consulta de comportamiento',detail:'Combinar fuente y cambio Run con el dato escrito y las rutas verificadas del caso. Evitar depender del nombre exacto del archivo, de una cuenta de emulación o de la línea de comandos que el docente utilizó.'},{source:'Regla y previsualización',detail:'Guardar la regla inicialmente deshabilitada en el espacio personal. Documentar índices o vista de datos, consulta, campo temporal, intervalo y ventana adicional previstos; usar un periodo histórico explícito en la previsualización y comprobar sus límites.'}],
      boundary:'La regla es un objeto lógico de Kibana, no otro servidor. Guardarla o previsualizarla no acredita alertas de producción. La programación reciente por sí sola no vuelve a buscar toda una captura histórica.',
      action:'Construir y guardar la consulta y regla inicial, comprobar resultados históricos y registrar qué representan: documentos coincidentes o resultados de previsualización.',
      questions:['¿La consulta expresa el comportamiento o un indicador memorizado?','¿Están definidos fuentes y parámetros temporales?','¿Qué se comprobó realmente al previsualizar?'],
      result:'Una primera versión de detección reproducible y deshabilitada, con prueba histórica documentada.',
      caption:'Espacio personal → consulta/regla → previsualización histórica → resultados acotados.',
      nodes:['learner','rule','kibana','elasticsearch','report'],edges:['configure','preview','query','case-save']
    },
    {
      name:'Pruebas',context:'Validación · casos legítimos y variantes controladas',title:'Medir por caso y buscar también lo que se omite',
      narrative:['La detección se prueba con casos legítimos y adversarios de periodos definidos. Las variantes cambian nombres o ubicaciones manteniendo el comportamiento declarado. El alumno registra resultados antes de contrastarlos con la referencia de evaluación.'],
      description:'El banco incluye casos de desarrollo y un conjunto separado de validación. Para cada caso se establece una unidad de evaluación, periodo y criterio de coincidencia; después se contrasta lo observado con la referencia preparada por el instructor.',
      evidence:'Matriz de casos esperados y observados, con periodos, versión y referencias a resultados.',
      records:[{source:'Banco de pruebas',detail:'Casos adversarios y legítimos comparables, variantes de nombre o ubicación dentro del alcance, y periodos identificados. Las etiquetas y el guion de preparación no se entregan como pistas antes de registrar los resultados.'},{source:'Matriz de evaluación',detail:'Una decisión por caso: adversario detectado u omitido; legítimo señalado o no señalado. Deduplicar varias coincidencias del mismo caso según el criterio fijado, y registrar datos incompletos o resultados truncados.'}],
      boundary:'Contar documentos o sumar alertas repetidas no mide por sí solo los aciertos. Los casos sin datos suficientes se marcan no evaluables; no se convierten silenciosamente en negativos.',
      action:'Ejecutar la versión fijada sobre los periodos de prueba, registrar sus coincidencias y ausencias, y contrastarlas después con la referencia por caso.',
      questions:['¿La variante sigue dentro del comportamiento declarado?','¿Qué caso adversario quedó sin señal?','¿Una actividad legítima produjo una señal innecesaria?'],
      result:'Una matriz por caso con aciertos, falsos positivos, omisiones y negativos legítimos, sin inflar el recuento por duplicados.',
      caption:'Casos definidos → detección fijada → resultados por caso → comparación con la referencia.',
      nodes:['tests','learner','rule','kibana','report'],edges:['compare','configure','preview','case-save']
    },
    {
      name:'Ajuste',context:'Mejora controlada · conservar cobertura',title:'Reducir ruido sin borrar las variantes adversarias',
      narrative:['El alumno explica por qué un caso legítimo coincidió y por qué una variante pudo quedar fuera. Propone un cambio acotado y repite el conjunto de pruebas, en lugar de excluir una herramienta o un usuario de forma general.'],
      description:'Se revisan condiciones, rutas y excepciones limitadas. Cada cambio genera una nueva versión y se contrasta con la anterior. El conjunto de validación se mantiene separado durante el ajuste y se utiliza al evaluar la versión candidata.',
      evidence:'Diferencia entre versiones, motivo del ajuste y matriz de resultados repetida.',
      records:[{source:'Análisis del error',detail:'Relacionar el falso positivo o la omisión con datos y una condición concreta. Si el evento falta o el periodo es incorrecto, documentar ese problema antes de atribuirlo a la lógica de detección.'},{source:'Cambio y regresión',detail:'Acotar una excepción al contexto legítimo comprobado o corregir una condición demasiado estrecha. Repetir casos adversarios, legítimos y variantes; comprobar si el ajuste introduce pérdidas de cobertura.'}],
      boundary:'Excluir todo lo firmado, toda una carpeta o una cuenta de administración puede ocultar actividad adversaria. Si se ajusta después de ver la validación, esos casos ya no sirven como una evaluación nueva e independiente.',
      action:'Modificar una condición con justificación, versionar la detección y repetir las pruebas para comparar tanto el ruido como las omisiones.',
      questions:['¿Qué condición explica el error?','¿El ajuste elimina señales adversarias que antes se detectaban?','¿Qué casos permanecen separados del desarrollo?'],
      result:'Una versión ajustada con comparación antes/después y pérdidas de cobertura declaradas, si las hubiera.',
      caption:'Error explicado → ajuste acotado → repetición de pruebas → comparación de cobertura.',
      nodes:['tests','learner','rule','report'],edges:['compare','configure','case-save']
    },
    {
      name:'Documentación',context:'Entrega individual · métricas y límites',title:'Entregar una detección que otro analista pueda reproducir',
      narrative:['La entrega reúne hipótesis, consulta o regla, campos, periodos, versiones y pruebas. El alumno informa qué detectó y qué omitió en el conjunto evaluado y explica los límites que impiden generalizar sus resultados.'],
      description:'Se consolidan resultados por caso y se documentan las condiciones de uso. Se distingue entre la validación de la lógica sobre datos históricos y la operación de una regla habilitada con alertas reales.',
      evidence:'Ficha de detección, regla o consulta versionada y matriz trazable de validación.',
      records:[{source:'Métricas del conjunto',detail:'Aciertos adversarios (TP), falsos positivos (FP), omisiones adversarias (FN) y negativos legítimos (TN). Precisión = TP/(TP+FP); sensibilidad = TP/(TP+FN). Indicar tamaño del conjunto y no calcular una razón cuyo denominador sea cero.'},{source:'Ficha y límites',detail:'Hipótesis, fuentes, campos, periodos y zona, parámetros temporales, versión, excepciones, resultados, datos no evaluables y procedimiento de revisión. El alcance Run no cubre todas las formas de persistencia ni demuestra la ejecución del programa.'}],
      boundary:'Las métricas corresponden al conjunto probado; una buena cifra en una muestra pequeña no acredita cobertura general. La visualización no publica reglas ni genera alertas, y no muestra porcentajes inventados.',
      action:'Entregar la detección y su ficha junto con los recuentos y pruebas que permitan reproducir la evaluación, incluyendo errores y límites.',
      questions:['¿Otra persona puede repetir el periodo y obtener resultados comparables?','¿Se informan los fallos y los casos no evaluables?','¿Se distingue prueba histórica de funcionamiento operativo?'],
      result:'Un paquete individual de detección validada dentro de su alcance, con métricas, fuentes, versión y límites explícitos.',
      caption:'Regla versionada + pruebas trazables + métricas del conjunto + límites de cobertura.',
      nodes:['tests','learner','rule','report'],edges:['compare','configure','case-save']
    }
  ];
  const overview={
    context:'Vista general · módulo 04 · 6 horas',title:'Del comportamiento a una detección validada',
    narrative:['El recorrido continúa con el inicio automático Run examinado en el módulo 03. El alumno formula una hipótesis, comprueba campos y fechas, construye una consulta y regla en su espacio personal de Kibana y las prueba con actividad legítima y variantes adversarias.',
      'Las escenas finales muestran cómo medir los resultados, ajustar una condición y documentar la cobertura. Las tarjetas inferiores son el banco de pruebas, la ficha de detección y el alumno. La regla es un objeto lógico dentro de Kibana; ninguna tarjeta añade un servidor físico al laboratorio.'],
    description:'Se construye una detección de comportamiento y se valida con casos legítimos y adversarios de periodos definidos, manteniendo separados datos compartidos y objetos del alumno.',
    evidence:'Hipótesis, campos comprobados, consulta y regla, periodos, matriz de casos, versiones y ficha de cobertura.',
    boundary:'Basado en el módulo 04 de modelo-temario.docx. La página representa el diseño de la práctica: no consulta Elastic, guarda reglas ni presenta resultados medidos. Materiales y piloto pendientes.',
    action:'Construir una detección en el espacio personal de Kibana y probarla con casos legítimos y adversarios de periodos definidos; registrar aciertos, errores y límites de cobertura.',
    result:'Una detección versionada y reproducible con pruebas, métricas del conjunto y límites declarados.',
    caption:'Hipótesis → campos y período → consulta y regla → pruebas → ajuste → documentación.'
  };
  const components={
    caldera:['Servidor Caldera','Orquesta la emulación desde la red adversaria mediante un agente preinstalado. Sus variaciones permiten preparar casos controlados.','El guion, los comandos y las etiquetas de preparación se mantienen separados de la entrega inicial al alumno.'],
    instructor:['Instructor','Prepara y comprueba fuentes, casos legítimos y adversarios, variantes y referencia de evaluación.','Conserva una unidad de evaluación y periodos por caso. No etiqueta los resultados del alumno antes de que registre sus observaciones.'],
    'adversary-agent':['Agente Caldera','Ejecuta las tareas controladas dentro del objetivo; es distinto del agente de recolección.','El despliegue previo es un supuesto del caso, no una demostración de acceso inicial.'],
    activity:['Cambio de inicio automático','El caso propuesto incluye un cambio Run que referencia un programa y actividad legítima comparable.','Un cambio Run acredita configuración; la ejecución posterior requiere evidencia adicional.'],
    sensor:['Sysmon y registros','Generan los eventos locales necesarios para contrastar el comportamiento.','Para el cambio de valor se utiliza Sysmon 13, con proveedor, canal, equipo, objeto y datos escritos.'],
    collector:['Elastic Agent','Recolecta las fuentes configuradas y envía los eventos a Elasticsearch.','La correspondencia de campos y el periodo se comprueban sobre la captura. Fleet administra la política; se omite de este mapa centrado en la detección.'],
    elasticsearch:['Elasticsearch','Conserva los documentos del caso compartido para su consulta.','El alumno dispone de lectura sobre fuentes preparadas; los permisos concretos se validarán al preparar el laboratorio.'],
    kibana:['Kibana','Interfaz de construcción y previsualización histórica de la detección.','La consulta y los resultados se limitan a fuentes y periodos definidos. Una previsualización no equivale a alertas de una regla habilitada.'],
    rule:['Consulta y regla personal','Objeto lógico configurado dentro de Kibana. Se dibuja separado para hacer visible el trabajo del alumno; no es otro servidor.','Se guarda inicialmente deshabilitado en el espacio personal, con fuente, lógica y parámetros temporales documentados.'],
    tests:['Banco de pruebas','Materiales conservados: originales, casos legítimos y adversarios y variantes con periodos y procedencia. La tarjeta cambia a campos, pruebas o referencia según el paso.','Separar desarrollo de validación y contrastar la referencia después de registrar los resultados. La referencia docente no se publica aquí.'],
    report:['Ficha de detección','Documento individual con hipótesis, versiones, condiciones, resultados y límites.','Incluye matriz por caso y recuentos TP, FP, FN y TN; no se inventan números de rendimiento.'],
    learner:['Alumno / analista','Trabaja individualmente en su espacio personal de Kibana sobre fuentes compartidas de lectura.','Debe justificar condiciones y errores y demostrar cobertura en el conjunto, sin memorizar el guion del adversario.']
  };
  const edges=[
    {id:'instructor-control',from:'instructor',to:'caldera',type:'management',label:'Preparación de la campaña y variantes'},
    {id:'emulation',from:'caldera',to:'adversary-agent',type:'control',both:true,label:'Tareas y resultados del agente preinstalado'},
    {id:'execution',from:'adversary-agent',to:'activity',type:'control',label:'Actividad controlada en el objetivo'},
    {id:'local-record',from:'activity',to:'sensor',type:'data',label:'Registro local del comportamiento'},
    {id:'collection',from:'sensor',to:'collector',type:'data',label:'Recolección de fuentes'},
    {id:'shipping',from:'collector',to:'elasticsearch',type:'data',label:'Eventos enviados a Elasticsearch'},
    {id:'query',from:'kibana',to:'elasticsearch',type:'query',both:true,label:'Consulta sobre documentos y resultados'},
    {id:'preview',from:'rule',to:'kibana',type:'query',both:true,label:'Configuración y previsualización en Kibana; relación lógica'},
    {id:'configure',from:'learner',to:'rule',type:'query',label:'Construcción individual de la consulta y regla'},
    {id:'compare',from:'learner',to:'tests',type:'query',route:'under',label:'Contraste con originales y casos; relación de trabajo'},
    {id:'case-save',from:'learner',to:'report',type:'query',route:'horizontal',label:'Documentación de versiones y resultados'}
  ];
  const v=(label,detail,icon='icon-logs')=>[label,detail,icon];
  const motionSequences=[
    {type:'query',endTitle:'Hipótesis y alcance definidos',endDetail:'La señal observa un cambio Run bajo condiciones declaradas; requiere contraste con usos legítimos y no demuestra ejecución.',steps:[
      {nodes:['activity','sensor'],title:'Reconocer la conducta observable',view:{activity:v('Cambio de Run','Programa referenciado','icon-settings')}},
      {edge:'compare',nodes:['learner','tests'],title:'Incluir una explicación legítima',view:{tests:v('Contraste legítimo','Mismo mecanismo, otro contexto')}},
      {nodes:['learner'],title:'Fijar qué debe cubrir la detección'},
      {edge:'case-save',nodes:['learner','report'],title:'Escribir hipótesis y límites',view:{report:v('Hipótesis de detección','Conducta, fuentes y alcance','icon-archive')}}
    ]},
    {type:'data',endTitle:'Campos y período listos para consultar',endDetail:'La consulta parte de los campos observados y las fechas originales; los datos ausentes se documentan.',steps:[
      {nodes:['sensor','tests'],title:'Examinar el evento original',view:{tests:v('Original de referencia','Proveedor, tipo y contenido')}},
      {edge:'shipping',nodes:['collector','elasticsearch'],title:'Localizar el documento indexado'},
      {edge:'compare',nodes:['learner','tests'],title:'Comprobar la correspondencia de campos',view:{tests:v('Tabla de campos','Original ↔ documento indexado')}},
      {nodes:['learner','kibana'],title:'Delimitar el período original',view:{kibana:v('Período de prueba','Inicio, fin y zona horaria','icon-search')}}
    ]},
    {type:'query',endTitle:'Primera versión preparada para pruebas',endDetail:'Se conservan consulta, regla deshabilitada y parámetros. Las coincidencias históricas no se presentan como alertas operativas.',steps:[
      {edge:'configure',nodes:['learner','rule'],title:'Construir la consulta de comportamiento',view:{rule:v('Consulta inicial','Condiciones sobre campos reales','icon-search')}},
      {edge:'preview',nodes:['rule','kibana'],title:'Preparar la regla personal',view:{rule:v('Regla personal · v1','Guardada y deshabilitada','icon-settings')}},
      {edge:'query',nodes:['kibana','elasticsearch'],title:'Previsualizar el período histórico'},
      {edge:'query',reverse:true,nodes:['elasticsearch','kibana'],title:'Examinar los resultados de prueba',view:{kibana:v('Resultado histórico','Previsualización, no alertas en vivo','icon-search')}}
    ]},
    {type:'query',endTitle:'Resultados por caso registrados',endDetail:'La referencia permite contar aciertos y errores tras registrar los resultados; los datos insuficientes se declaran no evaluables.',steps:[
      {edge:'compare',nodes:['learner','tests'],title:'Seleccionar casos y períodos',view:{tests:v('Banco de casos','Legítimos y variantes adversarias')}},
      {edge:'configure',nodes:['learner','rule'],title:'Fijar la versión que se prueba',view:{rule:v('Versión en evaluación','Misma lógica para todos los casos','icon-settings')}},
      {edge:'preview',nodes:['rule','kibana'],title:'Registrar coincidencias y ausencias'},
      {edge:'case-save',nodes:['learner','report'],title:'Contrastar la referencia por caso',view:{report:v('Matriz de resultados','Aciertos, ruido y omisiones','icon-logs')}}
    ]},
    {type:'query',endTitle:'Ajuste comparado con la versión anterior',endDetail:'La nueva versión solo mejora si reduce el problema sin ocultar pérdidas de cobertura; la validación se distingue del desarrollo.',steps:[
      {edge:'compare',nodes:['learner','tests'],title:'Explicar un falso positivo u omisión',view:{tests:v('Caso que falló','Dato, condición y contexto')}},
      {edge:'configure',nodes:['learner','rule'],title:'Aplicar un ajuste acotado',view:{rule:v('Versión candidata · v2','Cambio justificado y limitado','icon-settings')}},
      {edge:'preview',nodes:['rule','kibana'],title:'Repetir pruebas y comprobar regresiones'},
      {edge:'case-save',nodes:['learner','report'],title:'Comparar ruido y cobertura',view:{report:v('Comparación v1 / v2','Cambios, mejoras y pérdidas','icon-logs')}}
    ]},
    {type:'query',endTitle:'Detección y evaluación documentadas',endDetail:'La entrega permite reproducir las pruebas y declara métricas del conjunto, errores, límites y condiciones de uso.',steps:[
      {edge:'configure',nodes:['learner','rule'],title:'Identificar la versión entregada',view:{rule:v('Detección versionada','Consulta, fuentes y parámetros','icon-settings')}},
      {edge:'compare',nodes:['learner','tests'],title:'Consolidar los resultados evaluables',view:{tests:v('Casos evaluados','Periodos, fuentes y referencia')}},
      {edge:'case-save',nodes:['learner','report'],title:'Informar aciertos y errores',view:{report:v('TP · FP · FN · TN','Recuentos y métricas del conjunto','icon-logs')}},
      {nodes:['learner','report'],title:'Declarar cobertura y límites',view:{report:v('Ficha de detección','Pruebas reproducibles y límites','icon-archive')}}
    ]}
  ];
  const stepNarratives=[
    [
      'Se destacan la actividad en Windows y sus registros. La hipótesis parte de un cambio Run que referencia un programa en una ubicación confirmada como modificable por el usuario; pretende reconocer una conducta, aunque cambie el nombre del archivo.',
      'La conexión une al alumno con una actividad legítima comparable: una aplicación instalada por usuario también puede usar Run. Esa coincidencia obliga a diseñar pruebas y contexto, en lugar de tratar todo inicio automático como intrusión.',
      'El foco queda en el analista. Define qué cambios Run debe señalar la detección, qué variantes siguen dentro del alcance y qué fuentes necesita. Otras formas de persistencia quedan fuera de esta hipótesis.',
      'El alumno incorpora la hipótesis a su ficha: conducta, condiciones, fuentes y límites. Un cambio de configuración puede justificar investigación, pero no prueba que el programa se haya ejecutado ni que sea malicioso.'
    ],
    [
      'Se destacan Sysmon y el original de referencia. El alumno examina proveedor, canal y evento 13 del cambio, junto con el objeto de registro, los datos escritos y el proceso modificador.',
      'El mensaje azul llega de Elastic Agent a Elasticsearch. El alumno localiza el documento correspondiente y comprueba cómo se conservó su contenido; los nombres y tipos de campo dependen de la integración realmente utilizada.',
      'La tarjeta pasa a tabla de campos. El alumno contrasta el original con el documento para identificar dónde están la ruta Run, el dato escrito, el equipo y el proceso, incluyendo listas o valores ausentes que afectarían a la consulta.',
      'El foco pasa al alumno y al periodo de prueba en Kibana. Se fija inicio, fin y zona horaria de los hechos originales y se comprueba el campo temporal utilizado; buscar solo los últimos minutos no recuperaría por sí mismo una captura antigua.'
    ],
    [
      'La conexión llega a la consulta personal. El alumno expresa la hipótesis con los campos comprobados y las rutas verificadas del caso, evitando depender de un nombre de archivo o comando exclusivo de la emulación.',
      'La tarjeta cambia a regla personal v1 y se conecta con Kibana. Es un objeto lógico en el espacio del alumno, inicialmente deshabilitado, con fuentes, lógica y parámetros temporales documentados; no representa un servidor nuevo.',
      'La consulta de previsualización se dirige desde Kibana a Elasticsearch sobre un periodo histórico explícito. Se comprueban también los límites y cualquier truncamiento de la prueba, para no interpretar una muestra como el conjunto completo.',
      'El mensaje de resultados vuelve a Kibana. El alumno revisa las coincidencias y conserva su relación con el periodo y la versión. Son resultados de prueba; todavía no acreditan la operación de una regla habilitada con alertas reales.'
    ],
    [
      'La conexión llega al banco de pruebas: casos legítimos y adversarios, variantes dentro del alcance y periodos definidos. Se separan los casos de desarrollo y los reservados para validación, sin revelar las etiquetas antes de registrar resultados.',
      'El alumno fija la versión que se someterá a prueba. La misma lógica y el mismo criterio de coincidencia se aplican al conjunto; cambiar la regla entre casos impediría comparar sus resultados de forma consistente.',
      'La regla se conecta con la previsualización en Kibana. Se anotan las coincidencias y también las ausencias por caso. Varias coincidencias del mismo caso no se cuentan automáticamente como varios aciertos.',
      'La matriz llega a la ficha y se contrasta con la referencia después de registrar los resultados. Se distinguen adversarios detectados u omitidos y legítimos señalados o no señalados; los casos con datos insuficientes se marcan aparte.'
    ],
    [
      'El alumno vuelve al caso que falló. Busca qué dato y condición explican el falso positivo o la omisión; primero descarta problemas de periodo, campos o captura que podrían confundirse con un error de la lógica.',
      'La conexión pasa a una versión candidata v2. Se cambia una condición o excepción con alcance limitado y motivo escrito; no se excluyen en bloque usuarios, firmas o carpetas que también podrían intervenir en actividad adversaria.',
      'La nueva versión vuelve a probarse en Kibana con los casos de desarrollo para buscar regresiones. La validación separada se reserva para evaluar la candidata; si después se ajusta usando esos resultados, deja de ser una prueba independiente.',
      'La ficha compara v1 y v2: ruido que disminuye, casos que se recuperan y casos que se pierden. Una mejora aparente en falsos positivos debe acompañarse de la comprobación de que no aumentan las omisiones.'
    ],
    [
      'El alumno identifica la versión entregada de consulta y regla, sus fuentes, campos y parámetros temporales. La ficha distingue el objeto guardado de su estado de ejecución y de lo que realmente se probó.',
      'El banco reúne los casos evaluables, sus periodos y referencias. El alumno declara el tamaño del conjunto y deja fuera del cálculo, de forma visible, los casos que no pudieron evaluarse por falta de datos o una prueba incompleta.',
      'La ficha incorpora los recuentos: TP son adversarios detectados; FP, legítimos señalados; FN, adversarios omitidos; TN, legítimos no señalados. Permiten calcular precisión y sensibilidad cuando sus denominadores son distintos de cero; aquí no se muestran cifras inventadas.',
      'El foco queda en el alumno y la ficha final. La entrega explica cómo repetir la prueba, qué cubre la detección y qué deja fuera. Los resultados describen el conjunto evaluado y no una garantía general frente a todas las técnicas de persistencia.'
    ]
  ];
  window.BlueTeamModule={meta:{mapTitle:'Red adversaria ↔ red objetivo → red de Elastic'},scenes,overview,components,edges,motionSequences,stepNarratives};
})();
