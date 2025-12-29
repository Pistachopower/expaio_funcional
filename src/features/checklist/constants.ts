import { Task } from './types';

export const DEFAULT_TASKS: Task[] = [
    // --- Fase Planificación ---
    {
        id: 'p1',
        title: 'Contrato de Trabajo',
        description: 'Imprescindible para permiso y alquiler.',
        phase: 'planificacion',
        completed: false,
        isSystem: true,
        details: {
            requirements: ['Pasaporte válido', 'Currículum Vitae', 'Carta de motivación'],
            tips: 'Asegúrate de que el salario bruto mensual permita vivir en el cantón de destino. Verifica si incluye 13º salario.',
            options: ['Jobs.ch', 'LinkedIn', 'Indeed.ch']
        }
    },
    {
        id: 'p2',
        title: 'Alojamiento Temporal',
        description: 'Airbnb o apartamento temporal para empadronarte.',
        phase: 'planificacion',
        completed: false,
        isSystem: true,
        details: {
            requirements: ['Depósito (generalmente 1 mes)', 'ID/Pasaporte'],
            costs: '800 - 2000 CHF / mes (habitación vs estudio)',
            options: ['Airbnb', 'UMS.ch (Untermiete)', 'Wgzimmer.ch', 'CityPop'],
            tips: 'Necesitas que el dueño te permita poner tu nombre en el buzón para recibir correspondencia oficial.'
        }
    },
    {
        id: 'p3',
        title: 'Ahorro Inicial',
        description: 'Calcula 3 meses de gastos + fianza.',
        phase: 'planificacion',
        completed: false,
        isSystem: true,
        details: {
            costs: 'Mínimo recomendado: 5,000 - 7,000 CHF',
            tips: 'Usa nuestra calculadora de costos para un estimado preciso.'
        }
    },

    // --- Fase Llegada ---
    {
        id: 'l1',
        title: 'Registro en Gemeinde',
        description: 'Obligatorio en los primeros 14 días.',
        phase: 'llegada',
        completed: false,
        isSystem: true,
        details: {
            requirements: ['Pasaporte / DNI', 'Contrato de trabajo', 'Contrato de alquiler', 'Foto tamaño pasaporte', 'Dinero para tasas (aprox 40-100 CHF)'],
            tips: 'Te darán un documento provisional mientras llega tu permiso (tarjeta) por correo.'
        }
    },
    {
        id: 'l2',
        title: 'Cuenta Bancaria',
        description: 'Necesaria para salario y pagos (IBAN Suizo).',
        phase: 'llegada',
        completed: false,
        isSystem: true,
        details: {
            requirements: ['Pasaporte', 'Permiso de residencia (L/B) o confirmación de registro'],
            options: ['Neon (Digital, Gratis)', 'Zak (Digital, Gratis)', 'UBS (Tradicional)', 'PostFinance (Tradicional)', 'Yuh (Digital)'],
            costs: 'Digitales: 0 CHF/mes. Tradicionales: 5-15 CHF/mes.',
            tips: 'Neon y Zak suelen ser los más fáciles de abrir con solo el papel de registro provisional.'
        }
    },
    {
        id: 'l3',
        title: 'Seguro Médico (KVG)',
        description: 'Obligatorio. Tienes 3 meses para hacerlo.',
        phase: 'llegada',
        completed: false,
        link: '/insurance-guide',
        isSystem: true,
        details: {
            requirements: ['Permiso de residencia o registro', 'Dirección suiza'],
            options: ['Sanitas', 'Groupe Mutuel', 'Helsana', 'CSS', 'Assura (Económico)'],
            costs: '300 - 500 CHF/mes dependiendo de la franquicia y modelo.',
            tips: 'Usa Comparis.ch para comparar. Elige modelo "Telmed" o "Medico de cabecera" para ahorrar.'
        }
    },
    {
        id: 'l4',
        title: 'Responsabilidad Civil',
        description: 'Privathaftpflicht. Clave para alquilar.',
        phase: 'llegada',
        completed: false,
        isSystem: true,
        details: {
            requirements: ['Dirección suiza'],
            costs: '100 - 160 CHF al AÑO.',
            options: ['AXA', 'Zurich', 'Helvetia', 'Smile Direct (Digital)'],
            tips: 'Cubre daños que causes al apartamento alquilado. Casi todos los caseros lo exigen.'
        }
    },
    {
        id: 'l5',
        title: 'Transporte (SwissPass)',
        description: 'Tarjeta Halbtax para viajar a mitad de precio.',
        phase: 'llegada',
        completed: false,
        isSystem: true,
        details: {
            requirements: ['Pasaporte', 'Foto reciente'],
            costs: 'Halbtax: 190 CHF/año (primera vez), 170 CHF (renovación).',
            options: ['Halbtax (Mitad precio)', 'GA (Viajes ilimitados, muy caro)', 'Seven25 (Jóvenes)'],
            tips: 'Descarga la app de SBB Mobile. Es imprescindible.'
        }
    },
    {
        id: 'l6',
        title: 'Internet / Móvil',
        description: 'Contrato de teléfono y fibra.',
        phase: 'llegada',
        completed: false,
        isSystem: true,
        details: {
            options: ['Swisscom (Premium)', 'Sunrise', 'Salt', 'Wingo (Low cost Swisscom)', 'Yallo (Low cost Sunrise)'],
            costs: 'Móvil: 20-60 CHF/mes. Internet casa: 40-80 CHF/mes.',
            tips: 'Busca ofertas "Lifetime" en Yallo o Wingo. Evita contratos de 24 meses si es posible.'
        }
    }
];
