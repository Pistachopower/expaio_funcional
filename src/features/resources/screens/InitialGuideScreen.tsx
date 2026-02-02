import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Section {
  id: string;
  title: string;
  icon: string;
  color: string;
  content: React.ReactNode;
}

// Diccionario de términos y abreviaciones
const glossary: { [key: string]: { title: string; definition: string; category?: string } } = {
  'ALCP': {
    title: 'ALCP',
    definition: 'Acuerdo sobre la Libre Circulación de Personas. Tratado entre Suiza y la UE que permite a los ciudadanos europeos vivir y trabajar en Suiza con igualdad de condiciones.',
    category: 'Legal'
  },
  'SEM': {
    title: 'SEM',
    definition: 'Secretaría de Estado de Migración (Staatssekretariat für Migration). Organismo federal suizo responsable de la política migratoria y los permisos de residencia.',
    category: 'Organismos'
  },
  'SEFRI': {
    title: 'SEFRI',
    definition: 'Secretaría de Estado para la Formación, la Investigación y la Innovación. Organismo que valida títulos de formación profesional y técnica.',
    category: 'Organismos'
  },
  'Mebeko': {
    title: 'Mebeko',
    definition: 'Comisión Federal de Profesiones Médicas. Organismo encargado de reconocer títulos de medicina, farmacia y otras profesiones sanitarias universitarias.',
    category: 'Organismos'
  },
  'EDK': {
    title: 'EDK',
    definition: 'Conferencia Suiza de Directores Cantonales de Educación Pública. Organismo que reconoce títulos de enseñanza y profesorado.',
    category: 'Organismos'
  },
  'LAMal': {
    title: 'LAMal',
    definition: 'Ley Federal del Seguro de Enfermedad (Krankenversicherungsgesetz). Establece el seguro médico obligatorio en Suiza con cobertura básica uniforme.',
    category: 'Legal'
  },
  'SES': {
    title: 'SES',
    definition: 'Sistema de Entradas y Salidas. Sistema biométrico europeo implementado desde abril 2026 que registra entradas/salidas de nacionales de terceros países.',
    category: 'Legal'
  },
  'ETIAS': {
    title: 'ETIAS',
    definition: 'Sistema Europeo de Información y Autorización de Viajes. Autorización de viaje electrónica (20€) requerida para ciudadanos no-UE que visiten el espacio Schengen.',
    category: 'Legal'
  },
  'AVS': {
    title: 'AVS/AHV',
    definition: 'Assurance-vieillesse et survivants / Alters- und Hinterlassenenversicherung. Primer pilar del sistema de pensiones suizo (seguro de vejez y supervivencia).',
    category: 'Seguridad Social'
  },
  'AHV': {
    title: 'AVS/AHV',
    definition: 'Alters- und Hinterlassenenversicherung. Primer pilar del sistema de pensiones suizo, equivalente a la Seguridad Social española.',
    category: 'Seguridad Social'
  },
  'LPP': {
    title: 'LPP/BVG',
    definition: 'Loi sur la Prévoyance Professionnelle. Segundo pilar del sistema de pensiones suizo (previsión profesional obligatoria).',
    category: 'Seguridad Social'
  },
  'BVG': {
    title: 'LPP/BVG',
    definition: 'Bundesgesetz über die berufliche Vorsorge. Ley federal sobre la previsión profesional, segundo pilar de pensiones.',
    category: 'Seguridad Social'
  },
  'CHF': {
    title: 'CHF',
    definition: 'Franco suizo (Confoederatio Helvetica Franc). Moneda oficial de Suiza. 1 CHF ≈ 1.05 EUR (tipo de cambio variable).',
    category: 'Finanzas'
  },
  'Quellensteuer': {
    title: 'Quellensteuer',
    definition: 'Impuesto en origen. Sistema fiscal que aplica a trabajadores extranjeros sin permiso C, donde el empleador retiene directamente los impuestos del salario.',
    category: 'Fiscalidad'
  },
  'Permiso B': {
    title: 'Permiso B',
    definition: 'Permiso de residencia para ciudadanos UE/AELC con contrato de trabajo de más de 1 año o indefinido. Validez de 5 años, renovable.',
    category: 'Permisos'
  },
  'Permiso L': {
    title: 'Permiso L',
    definition: 'Permiso de corta duración para ciudadanos UE/AELC con contrato de 3 meses a 1 año. Válido durante la duración del contrato.',
    category: 'Permisos'
  },
  'Permiso C': {
    title: 'Permiso C',
    definition: 'Permiso de establecimiento permanente. Se obtiene tras 5-10 años de residencia continua. Exento de impuesto en origen y con más derechos.',
    category: 'Permisos'
  },
  'Permiso G': {
    title: 'Permiso G',
    definition: 'Permiso de fronterizo (Grenzgänger). Para trabajadores que residen en país vecino y cruzan la frontera diariamente para trabajar en Suiza.',
    category: 'Permisos'
  },
  'IBAN': {
    title: 'IBAN',
    definition: 'International Bank Account Number. Número de cuenta bancaria internacional. En Suiza comienza con "CH" seguido de 19 caracteres.',
    category: 'Finanzas'
  },
  'Franchise': {
    title: 'Franchise',
    definition: 'Franquicia del seguro médico. Cantidad anual (300-2500 CHF) que pagas de tu bolsillo antes de que el seguro cubra gastos. Mayor franquicia = menor prima mensual.',
    category: 'Seguros'
  },
  'Quote-part': {
    title: 'Quote-part',
    definition: 'Participación en los costes sanitarios. Después de superar la franquicia, pagas el 10% de los gastos hasta un máximo de 700 CHF/año.',
    category: 'Seguros'
  },
  'Caisse maladie': {
    title: 'Caisse maladie',
    definition: 'Caja de enfermedad / Aseguradora de salud. Entidades privadas que ofrecen el seguro obligatorio LAMal (ej: CSS, Helsana, Swica, Sanitas).',
    category: 'Seguros'
  },
  'Kaution': {
    title: 'Kaution / Dépôt de garantie',
    definition: 'Depósito de garantía del alquiler. Equivale a 1-3 meses de renta y debe depositarse en cuenta bloqueada o mediante seguro de caución.',
    category: 'Vivienda'
  },
  'Nebenkosten': {
    title: 'Nebenkosten',
    definition: 'Gastos adicionales del alquiler (calefacción, agua, mantenimiento). Pueden estar incluidos en la renta o pagarse aparte como anticipo mensual.',
    category: 'Vivienda'
  },
  'Betreibungsauszug': {
    title: 'Betreibungsauszug',
    definition: 'Extracto del registro de cobranzas. Documento oficial que certifica si tienes deudas pendientes. Imprescindible para alquilar vivienda.',
    category: 'Documentos'
  },
  'RAV': {
    title: 'RAV',
    definition: 'Regionales Arbeitsvermittlungszentrum. Oficina Regional de Empleo suiza, equivalente al SEPE español. Gestiona prestaciones por desempleo.',
    category: 'Empleo'
  },
  'Einwohnerkontrolle': {
    title: 'Einwohnerkontrolle',
    definition: 'Control de habitantes / Registro civil municipal. Oficina donde debes empadronarte en los primeros 14 días tras llegar a tu comuna.',
    category: 'Trámites'
  },
  'Gemeinde': {
    title: 'Gemeinde',
    definition: 'Municipio o comuna. La unidad administrativa más pequeña en Suiza. Cada comuna tiene su propia administración y tasas fiscales.',
    category: 'Administración'
  },
  'Kanton': {
    title: 'Kanton',
    definition: 'Cantón. Cada uno de los 26 estados federados de Suiza con amplia autonomía legislativa, fiscal y administrativa.',
    category: 'Administración'
  },
};

// Componente para términos del glosario
const GlossaryTerm: React.FC<{ 
  term: string; 
  children?: React.ReactNode;
  onTermClick: (term: string) => void;
}> = ({ term, children, onTermClick }) => (
  <button
    onClick={() => onTermClick(term)}
    className="text-cyan-400 underline decoration-dotted underline-offset-2 hover:text-cyan-300 transition-colors cursor-help"
  >
    {children || term}
  </button>
);

// Modal del glosario
const GlossaryModal: React.FC<{
  term: string | null;
  onClose: () => void;
}> = ({ term, onClose }) => {
  if (!term || !glossary[term]) return null;
  
  const entry = glossary[term];
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div 
        className="relative bg-[#1a1a2e] border border-cyan-500/30 rounded-2xl p-5 max-w-sm w-full shadow-2xl shadow-cyan-500/10 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-cyan-400 text-lg">menu_book</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{entry.title}</h3>
              {entry.category && (
                <span className="text-cyan-400 text-xs bg-cyan-500/10 px-2 py-0.5 rounded-full">
                  {entry.category}
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-white/60 text-lg">close</span>
          </button>
        </div>
        
        {/* Definition */}
        <p className="text-white/80 text-sm leading-relaxed">
          {entry.definition}
        </p>
        
        {/* Footer hint */}
        <p className="text-white/40 text-xs mt-4 flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">info</span>
          Toca fuera para cerrar
        </p>
      </div>
    </div>
  );
};

const colorClasses: { [key: string]: { bg: string; text: string; border: string; lightBg: string } } = {
  blue: { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500', lightBg: 'bg-blue-500/20' },
  green: { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500', lightBg: 'bg-green-500/20' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500', lightBg: 'bg-orange-500/20' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500', lightBg: 'bg-purple-500/20' },
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500', lightBg: 'bg-cyan-500/20' },
  red: { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500', lightBg: 'bg-red-500/20' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500', lightBg: 'bg-yellow-500/20' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-400', border: 'border-pink-500', lightBg: 'bg-pink-500/20' },
  teal: { bg: 'bg-teal-500', text: 'text-teal-400', border: 'border-teal-500', lightBg: 'bg-teal-500/20' },
};

const TipBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="my-4 p-4 bg-orange-500/10 rounded-xl border border-orange-500/30">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-orange-400 text-lg">lightbulb</span>
      </div>
      <div>
        <h4 className="text-orange-400 font-bold text-sm mb-1">{title}</h4>
        <p className="text-white/70 text-sm">{children}</p>
      </div>
    </div>
  </div>
);

const AlertBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-4 p-4 bg-red-500/10 rounded-xl border border-red-500/30">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-red-400 text-lg">warning</span>
      </div>
      <p className="text-white/70 text-sm">{children}</p>
    </div>
  </div>
);

const InfoTable: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => (
  <div className="my-4 overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/10">
          {headers.map((h, i) => (
            <th key={i} className="text-left py-2 px-3 text-orange-400 font-semibold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-white/5">
            {row.map((cell, j) => (
              <td key={j} className="py-2 px-3 text-white/70">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CheckList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-2 my-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-sm">
        <span className="material-symbols-outlined text-green-400 text-base mt-0.5 shrink-0">check_circle</span>
        <span className="text-white/70">{item}</span>
      </li>
    ))}
  </ul>
);

const SectionCard: React.FC<{
  section: Section;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}> = ({ section, isOpen, onToggle, index }) => {
  const colors = colorClasses[section.color];
  
  return (
    <div className="mb-4 animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
          isOpen ? 'bg-white/10 border border-white/20' : 'bg-white/5 hover:bg-white/10 border border-transparent'
        }`}
      >
        <div className={`w-12 h-12 rounded-xl ${colors.lightBg} flex items-center justify-center shrink-0`}>
          <span className={`material-symbols-outlined ${colors.text} text-2xl`}>{section.icon}</span>
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-white font-bold text-base">{section.title}</h3>
        </div>
        <span className={`material-symbols-outlined text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-2 p-4 bg-white/5 rounded-xl border border-white/10 animate-fade-in">
          {section.content}
        </div>
      )}
    </div>
  );
};

export const InitialGuideScreen: React.FC = () => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const handleTermClick = (term: string) => {
    setSelectedTerm(term);
  };

  const closeGlossary = () => {
    setSelectedTerm(null);
  };

  // Componente inline para usar dentro de sections con acceso al handler
  const Term: React.FC<{ t: string; children?: React.ReactNode }> = ({ t, children }) => (
    <GlossaryTerm term={t} onTermClick={handleTermClick}>
      {children}
    </GlossaryTerm>
  );

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const sections: Section[] = [
    {
      id: 'resumen',
      title: 'Resumen Básico',
      icon: 'info',
      color: 'cyan',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            El <Term t="Permiso B">Permiso B</Term> es tu pase de entrada al país. 
            Conviértelo de trámite en meta realizada y prepárate de este modo financiero, 
            administrativo y emocional. Con una buena planificación, es perfectamente alcanzable 
            en menos de un año.
          </p>
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="bg-white/5 p-3 rounded-xl text-center">
              <span className="material-symbols-outlined text-orange-400 text-2xl mb-1">payments</span>
              <p className="text-white font-bold text-lg">3-5k <Term t="CHF">CHF</Term></p>
              <p className="text-white/50 text-xs">Capital inicial</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl text-center">
              <span className="material-symbols-outlined text-orange-400 text-2xl mb-1">schedule</span>
              <p className="text-white font-bold text-lg">14 días</p>
              <p className="text-white/50 text-xs">Para registrarte</p>
            </div>
          </div>
          <p className="text-white/70 text-sm">
            El <Term t="Permiso B">permiso de residencia B</Term> es el documento esencial para los extranjeros que llegan a Suiza 
            con un contrato de trabajo indefinido o por una duración superior a 12 meses. 
            Tiene una validez de 5 años y es renovable.
          </p>
        </>
      ),
    },
    {
      id: 'registro',
      title: '1. Primeros Pasos: El Registro',
      icon: 'how_to_reg',
      color: 'blue',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            Desde el momento de tu llegada a Suiza, dispones de <strong className="text-white">14 días</strong> para 
            registrarte en la oficina de control de habitantes (<Term t="Einwohnerkontrolle">Einwohnerkontrolle</Term>) de tu <Term t="Gemeinde">comuna</Term>. 
            Hasta que no cumplas este trámite, no puedes empezar a trabajar.
          </p>
          
          <TipBox title="Tip del Experto">
            Llega a la oficina a primera hora. Anticipa posibles retrasos que pueden surgir 
            por falta de documentación. Pide siempre una cita previa cuando sea posible.
          </TipBox>
          
          <h4 className="text-white font-bold text-sm mt-4 mb-2">Oficinas por cantón:</h4>
          <InfoTable
            headers={['Cantón', 'Oficina', 'Idioma']}
            rows={[
              ['Zúrich', 'Migrationsamt Zürich', 'Alemán'],
              ['Ginebra', 'OCPM', 'Francés'],
              ['Berna', 'Amt für Bevölkerungsdienste', 'Alemán'],
              ['Vaud', 'SPOP Lausanne', 'Francés'],
            ]}
          />
        </>
      ),
    },
    {
      id: 'documentacion',
      title: '2. Documentación Necesaria',
      icon: 'folder_open',
      color: 'green',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            Asegúrate de llevar originales y copias de los siguientes documentos. 
            La administración suiza es extremadamente rigurosa en la verificación documental.
          </p>
          
          <CheckList items={[
            'DNI o Pasaporte español en vigor',
            'Contrato de trabajo original firmado por ambas partes',
            'Contrato de alquiler o carta de alojamiento del propietario',
            'Certificado de antecedentes penales apostillado',
            'Títulos académicos apostillados y traducidos',
            'Fotos tamaño pasaporte',
            'Justificante de seguro médico (si ya lo tienes)',
          ]} />
          
          <AlertBox>
            Sin contrato de trabajo firmado, no se puede iniciar el trámite del permiso B. 
            El contrato debe especificar duración, salario y condiciones.
          </AlertBox>
        </>
      ),
    },
    {
      id: 'costes',
      title: '3. Costes y Tiempos',
      icon: 'euro',
      color: 'orange',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            El coste varía según el cantón, pero debes reservar entre los 85 y 95 francos. 
            Puede subir hasta los 400 CHF si incluyes servicios adicionales.
          </p>
          
          <InfoTable
            headers={['Concepto', 'Coste (CHF)', 'Notas']}
            rows={[
              ['Tasa de registro comunal', '100-200', 'Varía por municipio'],
              ['Solicitud permiso B', '85-95', 'Tasa cantonal'],
              ['Tarjeta biométrica', '65-100', 'Obligatoria'],
              ['Traducciones juradas', '50-150', 'Por documento'],
            ]}
          />
          
          <div className="my-4 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-cyan-400">schedule</span>
              <span className="text-cyan-400 font-bold text-sm">Tiempo estimado</span>
            </div>
            <p className="text-white/70 text-sm">
              El permiso B tarda entre 2 y 6 semanas en emitirse. Mientras tanto, 
              recibirás un documento provisional que te permite trabajar legalmente.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'permisos',
      title: '4. Tipos de Permisos',
      icon: 'badge',
      color: 'purple',
      content: (
        <>
          <InfoTable
            headers={['Permiso', 'Duración', 'Validez', 'Para quién']}
            rows={[
              ['L (Corta duración)', '3-12 meses', 'Duración contrato', 'Trabajadores temporales'],
              ['B (Residencia)', '+12 meses', '5 años renovables', 'Contratos indefinidos'],
              ['C (Establecimiento)', 'Tras 5 años', 'Indefinido', 'Residentes permanentes'],
              ['G (Fronterizo)', 'Variable', 'Anual', 'Viven fuera, trabajan en Suiza'],
            ]}
          />
          
          <TipBox title="De B a C">
            Los ciudadanos españoles pueden obtener el <Term t="Permiso C">permiso C</Term> tras solo 5 años de residencia 
            (en lugar de 10 para otras nacionalidades) gracias al <Term t="ALCP">ALCP</Term>.
          </TipBox>
        </>
      ),
    },
    {
      id: 'vivienda',
      title: '5. Vivienda y Alquiler',
      icon: 'home',
      color: 'teal',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            El mercado inmobiliario suizo es uno de los más competitivos de Europa, 
            con tasas de vacantes inferiores al 1% en ciudades principales.
          </p>
          
          <h4 className="text-white font-bold text-sm mb-2">Dossier de alquiler obligatorio:</h4>
          <CheckList items={[
            'Contrato de trabajo y 3 últimas nóminas',
            'Copia del permiso de residencia',
            'Certificado de No Persecución de Deudas (Betreibungsauszug) - toca para más info',
            'Referencias de anteriores arrendadores',
          ]} />
          
          <InfoTable
            headers={['Ciudad', 'Alquiler medio (1 hab.)', 'Dificultad']}
            rows={[
              ['Zúrich', '2,184 CHF', 'Muy alta'],
              ['Ginebra', '2,263 CHF', 'Muy alta'],
              ['Basilea', '1,644 CHF', 'Alta'],
              ['Berna', '1,525 CHF', 'Media'],
              ['Lausana', '1,613 CHF', 'Alta'],
            ]}
          />
          
          <TipBox title="Seguro de Caución">
            En lugar de depositar 3 meses de fianza (4,000-7,000 CHF), puedes usar un seguro 
            de caución como SwissCaution pagando solo ~5% anual del valor.
          </TipBox>
        </>
      ),
    },
    {
      id: 'salud',
      title: '6. Seguro de Salud (LAMal)',
      icon: 'health_and_safety',
      color: 'red',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            El seguro de salud es <strong className="text-white">obligatorio</strong> en Suiza. 
            Tienes 3 meses desde tu llegada para contratar una póliza <Term t="LAMal">LAMal</Term>.
          </p>
          
          <InfoTable
            headers={['Concepto', 'Importe 2026', 'Notas']}
            rows={[
              ['Prima mensual media', '393.30 CHF', 'Varía por cantón y edad'],
              ['Franquicia mínima', '300 CHF', 'Mayor coste mensual'],
              ['Franquicia máxima', '2,500 CHF', 'Menor coste mensual'],
              ['Copago (10%)', 'Máx. 700 CHF/año', 'Tras superar franquicia'],
            ]}
          />
          
          <TipBox title="¿Qué es la franquicia?">
            La <Term t="Franchise">franquicia</Term> es lo que pagas de tu bolsillo antes de que el seguro cubra gastos. 
            Después, pagas un <Term t="Quote-part">10% de copago</Term> hasta 700 CHF/año.
          </TipBox>
          
          <AlertBox>
            El seguro dental NO está incluido en la cobertura básica. 
            Los tratamientos dentales en Suiza son extremadamente caros.
          </AlertBox>
        </>
      ),
    },
    {
      id: 'impuestos',
      title: '7. Sistema Fiscal',
      icon: 'account_balance',
      color: 'yellow',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            Con <Term t="Permiso L">permiso L</Term> o <Term t="Permiso B">B</Term>, el impuesto se retiene directamente de tu nómina 
            (impuesto en la fuente / <Term t="Quellensteuer">Quellensteuer</Term>). Cada <Term t="Kanton">cantón</Term> tiene tipos diferentes.
          </p>
          
          <InfoTable
            headers={['Cantón', 'Tipo impositivo', 'Observación']}
            rows={[
              ['Zug', '~11.9%', 'Más bajo del país'],
              ['Schwyz', '~12.3%', 'Muy ventajoso'],
              ['Zúrich', '~14.5%', 'Equilibrado'],
              ['Vaud', '~15.8%', 'Reducción 5% en 2026'],
              ['Ginebra', '~16.2%', 'Más alto, muy progresivo'],
            ]}
          />
          
          <TipBox title="Cuenta bancaria suiza">
            Necesitarás una cuenta con <Term t="IBAN">IBAN</Term> suizo (CH) para recibir tu salario. 
            Opciones: UBS, bancos cantonales (ZKB, BCV) o neobancos como Neon o Yuh.
          </TipBox>
        </>
      ),
    },
    {
      id: 'consulares',
      title: '8. Trámites Consulares',
      icon: 'flag',
      color: 'pink',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            Es obligatorio registrarse en el Consulado de España correspondiente 
            (Berna, Ginebra o Zúrich) para garantizar tu protección consular.
          </p>
          
          <h4 className="text-white font-bold text-sm mb-2">Modalidades de registro:</h4>
          <div className="space-y-3 mb-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-white font-semibold text-sm">No Residente</p>
              <p className="text-white/60 text-xs">Para estancias menores a 1 año. Mantiene empadronamiento en España.</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-white font-semibold text-sm">Residente</p>
              <p className="text-white/60 text-xs">Obligatorio si trasladas residencia permanente. Implica baja del padrón español.</p>
            </div>
          </div>
          
          <AlertBox>
            Los pensionistas españoles deben acreditar vivencia 2 veces en 2026 
            (enero-marzo y septiembre) mediante la app VIVESS o en la Consejería de Trabajo.
          </AlertBox>
        </>
      ),
    },
    {
      id: 'conduccion',
      title: '9. Conducción y Vehículos',
      icon: 'directions_car',
      color: 'blue',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            Tu carné de conducir español es válido durante el primer año. 
            Antes de que termine, debes canjearlo por el permiso suizo.
          </p>
          
          <CheckList items={[
            'El canje no requiere examen para españoles',
            'Se realiza en la oficina cantonal de vehículos (Strassenverkehrsamt)',
            'Coste aproximado: 50-80 CHF',
            'Vehículos con matrícula española deben matricularse tras 1 año',
          ]} />
          
          <TipBox title="Idioma local">
            Aunque puedes trabajar en multinacionales en inglés, el idioma local (B1/B2) 
            es esencial para integración social, mejores alquileres y movilidad profesional.
          </TipBox>
        </>
      ),
    },
    {
      id: 'presupuesto',
      title: '10. Presupuesto Primer Mes',
      icon: 'savings',
      color: 'green',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            Estimación realista para el primer mes en una ciudad de tamaño medio 
            como Lausana o Berna:
          </p>
          
          <InfoTable
            headers={['Concepto', 'Importe (CHF)', 'Notas']}
            rows={[
              ['Alojamiento', '1,800', 'Estudio o apto. pequeño'],
              ['Garantía alquiler', '4,500', '3 meses (o ~250 con seguro)'],
              ['Seguro médico', '400', 'Prima mensual'],
              ['Alimentación', '700', 'Supermercados locales'],
              ['Transporte', '80', 'Abono mensual'],
              ['Tasas registro', '150', 'Empadronamiento + permiso'],
              ['Telefonía/Internet', '100', 'Servicios básicos'],
            ]}
          />
          
          <div className="mt-4 p-4 bg-orange-500/20 rounded-xl border border-orange-500/50">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">TOTAL INICIAL</span>
              <span className="text-orange-400 font-bold text-xl">~7,730 CHF</span>
            </div>
            <p className="text-white/60 text-xs mt-1">
              Con seguro de caución se reduce a ~3,500 CHF
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'marco-legal',
      title: '11. Marco Legal y Contexto 2026',
      icon: 'gavel',
      color: 'purple',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            El año 2026 marca un hito en la política migratoria suiza debido a la implementación 
            del <Term t="SES">Sistema de Entradas y Salidas (SES)</Term> y cambios regulatorios importantes.
          </p>
          
          <h4 className="text-white font-bold text-sm mb-2">Acuerdo sobre Libre Circulación (<Term t="ALCP">ALCP</Term>)</h4>
          <p className="text-white/70 text-sm mb-4">
            El <Term t="ALCP">ALCP</Term> garantiza a los nacionales españoles el derecho de entrada, residencia y 
            acceso al mercado laboral en condiciones de paridad con los ciudadanos locales.
          </p>
          
          <AlertBox>
            La "Iniciativa de los 10 millones" busca establecer un tope poblacional que podría 
            limitar nuevos permisos si se superan 9.5 millones de habitantes. Aunque el Consejo 
            Federal mantiene su compromiso con el <Term t="ALCP">ALCP</Term>, se exige mayor integración lingüística.
          </AlertBox>
          
          <h4 className="text-white font-bold text-sm mt-4 mb-2">Sistema <Term t="SES">SES</Term> y <Term t="ETIAS">ETIAS</Term></h4>
          <InfoTable
            headers={['Requisito', 'Para españoles', 'Para familiares No-UE']}
            rows={[
              ['Pasaporte/DNI', 'Obligatorio en vigor', 'Pasaporte obligatorio'],
              ['ETIAS', 'No aplica', 'Obligatorio (finales 2026)'],
              ['Registro SES', 'No aplica', 'Registro biométrico obligatorio'],
              ['Visado Tipo D', 'Solo para >90 días', 'Según nacionalidad'],
            ]}
          />
        </>
      ),
    },
    {
      id: 'titulos',
      title: '12. Validación de Títulos Académicos',
      icon: 'school',
      color: 'blue',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            La validación de títulos es un paso previo indispensable para sectores regulados. 
            Puede demorar varios meses y las tasas varían entre 150 <Term t="CHF">CHF</Term> y 1.000 <Term t="CHF">CHF</Term>.
          </p>
          
          <InfoTable
            headers={['Organismo', 'Ámbito', 'Trámite']}
            rows={[
              ['SEFRI', 'Formación profesional y técnica', 'Atestación de nivel / Equivalencia'],
              ['Mebeko', 'Medicina y farmacia', 'Reconocimiento de títulos universitarios'],
              ['Cruz Roja Suiza', 'Enfermería y sanitarias', 'Registro y reconocimiento profesional'],
              ['EDK', 'Enseñanza y educación', 'Reconocimiento para profesorado'],
            ]}
          />
          
          <TipBox title="Organismos clave">
            <Term t="SEFRI">SEFRI</Term> para FP y técnicos, <Term t="Mebeko">Mebeko</Term> para medicina, 
            <Term t="EDK">EDK</Term> para enseñanza. Cada uno tiene procesos y tasas diferentes.
          </TipBox>
          
          <TipBox title="Importante">
            Inicia el apostillado y traducción jurada (al alemán, francés o italiano, 
            según el <Term t="Kanton">cantón</Term> de destino) ANTES de salir de España. Usa traductores jurados oficiales.
          </TipBox>
        </>
      ),
    },
    {
      id: 'empleo',
      title: '13. Búsqueda de Empleo y CV Suizo',
      icon: 'work',
      color: 'orange',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            El mercado laboral suizo es altamente competitivo. No se recomienda el traslado 
            sin una estrategia de búsqueda previa o, idealmente, un contrato firmado.
          </p>
          
          <h4 className="text-white font-bold text-sm mb-2">Portales de empleo principales:</h4>
          <CheckList items={[
            'jobs.ch - El portal más grande de Suiza',
            'jobup.ch - Popular en la Suiza francófona',
            'indeed.ch - Ofertas internacionales',
            'LinkedIn - Esencial para networking',
          ]} />
          
          <h4 className="text-white font-bold text-sm mt-4 mb-2">El CV suizo debe ser:</h4>
          <CheckList items={[
            'Directo y basado en competencias verificables',
            'Acompañado de certificados de trabajo previos',
            'Con foto profesional (es estándar en Suiza)',
            'Máximo 2 páginas, estructura clara',
            'En el idioma del cantón o en inglés para multinacionales',
          ]} />
          
          <TipBox title="Sectores con mayor demanda">
            Las empresas suizas priorizan perfiles en ingeniería, salud y tecnologías 
            de la información. Estos sectores ofrecen los mejores salarios y facilidades de contratación.
          </TipBox>
        </>
      ),
    },
    {
      id: 'cantones',
      title: '14. Guía por Cantones',
      icon: 'location_on',
      color: 'teal',
      content: (
        <>
          <h4 className="text-white font-bold text-sm mb-3">Cantón de Zúrich (ZH)</h4>
          <div className="p-3 bg-white/5 rounded-lg mb-4">
            <CheckList items={[
              'Centro de finanzas y tecnología, salarios más altos',
              'Oficina: Migrationsamt, Berninastrasse 45, 8090 Zürich',
              'Tel: +41 43 259 88 00',
              'Idioma: Alemán (nivel mínimo exigido para renovaciones)',
            ]} />
          </div>
          
          <h4 className="text-white font-bold text-sm mb-3">Cantón de Ginebra (GE)</h4>
          <div className="p-3 bg-white/5 rounded-lg mb-4">
            <CheckList items={[
              'Afinidad con francés, sede de organizaciones internacionales',
              'Oficina: OCPM, Route de Chancy 88, 1211 Onex',
              'Tel: +41 22 546 48 00',
              'Mercado de vivienda más tensionado',
            ]} />
          </div>
          
          <h4 className="text-white font-bold text-sm mb-3">Cantón de Berna (BE)</h4>
          <div className="p-3 bg-white/5 rounded-lg mb-4">
            <CheckList items={[
              'Capital federal, administración pública y tecnología médica',
              'Oficina: Amt für Bevölkerungsdienste, Ostermundigenstrasse 99B, 3006 Bern',
              'Tel: +41 31 633 53 15',
              'Sede de Embajada de España (Kirchenfeldstrasse 42)',
            ]} />
          </div>
          
          <h4 className="text-white font-bold text-sm mb-3">Cantón de Vaud (VD)</h4>
          <div className="p-3 bg-white/5 rounded-lg mb-4">
            <CheckList items={[
              'Centro de innovación y educación (EPFL)',
              'Oficina: SPOP, Avenue de Beaulieu 19, 1014 Lausanne',
              'Tel: +41 21 316 46 46',
              'Reducción del 5% en impuesto cantonal para 2026',
            ]} />
          </div>
        </>
      ),
    },
    {
      id: 'banca',
      title: '15. Banca y Finanzas',
      icon: 'account_balance_wallet',
      color: 'green',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            Necesitas una cuenta bancaria con IBAN suizo (CH) para recibir tu salario y 
            pagar facturas mediante el sistema QR suizo.
          </p>
          
          <h4 className="text-white font-bold text-sm mb-2">Opciones bancarias:</h4>
          <InfoTable
            headers={['Tipo', 'Ejemplos', 'Características']}
            rows={[
              ['Banca tradicional', 'UBS, Credit Suisse', 'Servicio completo, más costoso'],
              ['Bancos cantonales', 'ZKB (Zúrich), BCV (Vaud)', 'Buenos servicios, tarifas moderadas'],
              ['Neobancos', 'Neon, Yuh', 'Apertura gratuita y rápida, app móvil'],
            ]}
          />
          
          <TipBox title="Dato curioso">
            El uso de efectivo sigue siendo valorado en Suiza. En marzo de 2026 se votó 
            la iniciativa "El efectivo es libertad", reflejando la importancia cultural del dinero físico.
          </TipBox>
        </>
      ),
    },
    {
      id: 'conclusiones',
      title: '16. Conclusiones y Recomendaciones',
      icon: 'lightbulb',
      color: 'yellow',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            El proceso migratorio hacia Suiza en 2026 se define por una paradoja: mientras el 
            ALCP garantiza derechos fundamentales, el entorno se ha vuelto más exigente.
          </p>
          
          <h4 className="text-white font-bold text-sm mb-2">Claves del éxito:</h4>
          <CheckList items={[
            'Planificación meticulosa del dossier de alquiler',
            'Elección estratégica del cantón según perfil fiscal',
            'Contratación inmediata del seguro médico',
            'Demostrar empleabilidad inmediata en sectores críticos',
            'Voluntad explícita de integración cultural y lingüística',
          ]} />
          
          <div className="mt-4 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
            <p className="text-white/70 text-sm">
              <strong className="text-cyan-400">Mentalidad de inversión:</strong> Aborda este proyecto 
              invirtiendo capital financiero (para soportar los costes de entrada) y formativo 
              (para navegar un sistema descentralizado donde cada cantón impone sus propias reglas).
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'fuentes',
      title: '📚 Fuentes y Bibliografía',
      icon: 'menu_book',
      color: 'cyan',
      content: (
        <>
          <p className="text-white/70 text-sm mb-4">
            Esta guía ha sido elaborada con información de fuentes oficiales y especializadas 
            actualizadas para 2026:
          </p>
          
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-orange-400 font-semibold mb-1">Gobierno de Suiza</p>
              <ul className="text-white/60 space-y-1">
                <li>• Secretaría de Estado de Migración (SEM)</li>
                <li>• SEFRI - Secretaría de Educación, Investigación e Innovación</li>
                <li>• zas.admin.ch - Acuerdo sobre libre circulación</li>
              </ul>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-orange-400 font-semibold mb-1">Gobierno de España</p>
              <ul className="text-white/60 space-y-1">
                <li>• Ministerio de Asuntos Exteriores - Embajada en Berna</li>
                <li>• Ministerio de Trabajo y Economía Social - Consejería en Suiza</li>
                <li>• mites.gob.es - Guía de libre circulación</li>
              </ul>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-orange-400 font-semibold mb-1">Seguros y Finanzas</p>
              <ul className="text-white/60 space-y-1">
                <li>• comparis.ch - Comparador de seguros 2026</li>
                <li>• SwissCaution - Seguros de caución de alquiler</li>
                <li>• Sanitas - Sistema sanitario suizo</li>
              </ul>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-orange-400 font-semibold mb-1">Cantones</p>
              <ul className="text-white/60 space-y-1">
                <li>• ge.ch - Barèmes impôt à la source Genève 2026</li>
                <li>• vd.ch - Barèmes Canton de Vaud 2026</li>
                <li>• Migrationsamt Zürich, OCPM Genève, SPOP Lausanne</li>
              </ul>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-orange-400 font-semibold mb-1">Medios y Análisis</p>
              <ul className="text-white/60 space-y-1">
                <li>• SWI swissinfo.ch - Grandes temas políticos 2026</li>
                <li>• VisaHQ - Cuotas de permisos de trabajo 2026</li>
                <li>• Numbeo - Cost of Living in Switzerland 2026</li>
                <li>• emigrandoasuiza.com - Guías especializadas</li>
              </ul>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-orange-400 font-semibold mb-1">Inmobiliaria</p>
              <ul className="text-white/60 space-y-1">
                <li>• immobilier.ch - Agencias inmobiliarias</li>
                <li>• Wincasa, Livit, Naef, Bernard Nicod</li>
                <li>• lookmove.ch - Estadísticas del mercado</li>
              </ul>
            </div>
          </div>
          
          <p className="text-white/40 text-xs mt-4 italic">
            Última actualización: Enero 2026. La información puede variar según cambios 
            legislativos. Consulta siempre las fuentes oficiales antes de tomar decisiones.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      {/* Glossary Modal */}
      <GlossaryModal term={selectedTerm} onClose={closeGlossary} />
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-transparent pb-2">
        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-white">Guía Inicial</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 pb-32">
        {/* Hero Section */}
        <div className="relative mb-6 rounded-2xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80" 
            alt="Switzerland" 
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-5">
            <h2 className="text-2xl font-bold text-white mb-1">Cómo solicitar el Permiso B en Suiza</h2>
            <p className="text-white/70 text-sm">Guía completa de migración para españoles 2026</p>
          </div>
        </div>

        {/* Glossary Legend */}
        <div className="mb-4 p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center gap-3">
          <span className="material-symbols-outlined text-cyan-400">help</span>
          <p className="text-white/70 text-xs">
            Los términos <span className="text-cyan-400 underline decoration-dotted">subrayados en azul</span> son 
            interactivos. Toca para ver su significado.
          </p>
        </div>

        {/* Sections */}
        {sections.map((section, index) => (
          <SectionCard
            key={section.id}
            section={section}
            isOpen={openSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
            index={index}
          />
        ))}

        {/* Final CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/checklist')}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined">checklist</span>
            Ir a Mi Checklist
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialGuideScreen;
