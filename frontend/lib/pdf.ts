import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Jogador, PDFOptions } from "@/types";
import { calcAge, formatDate, API_URL, parseCharacteristic, simpleCapitalize } from "./utils";

async function getBase64ImageFromUrl(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result as string));
      reader.addEventListener("error", () => reject(null));
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("Erro ao carregar imagem para o PDF:", imageUrl);
    return null;
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export async function generatePlayerPDF(jogador: Jogador, options: PDFOptions) {
  const doc = new jsPDF();
  const primaryRGB = hexToRgb(options.primaryColor);
  const secondaryRGB = hexToRgb(options.secondaryColor);
  const darkGray: [number, number, number] = [30, 30, 30];
  const lightGray: [number, number, number] = [100, 100, 100];

  doc.setFillColor(...primaryRGB);
  doc.rect(0, 0, 210, 38, "F");
  doc.setTextColor(255, 255, 255);

  let textX = 14;

  if (options.clube_id) {
    const clube = jogador.clube_atual_id === options.clube_id
      ? jogador.clube_atual
      : jogador.historico_clubes?.find(h => h.clube_id === options.clube_id)?.clube;

    const logoUrl = clube?.logos?.[0]?.url_logo;
    if (logoUrl) {
      const logoBase64 = await getBase64ImageFromUrl(`${API_URL}/files/${logoUrl}`);
      if (logoBase64) {
        doc.addImage(logoBase64, "PNG", 10, 4, 30, 30);
        textX = 45;
      }
    }
  }

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(`FICHA DO ATLETA - ${options.category.toUpperCase()}`, textX, 18);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Relatório oficial gerado em ${new Date().toLocaleDateString("pt-BR")}`, textX, 26);

  if (jogador.foto) {
    const fotoBase64 = await getBase64ImageFromUrl(`${API_URL}/files/${jogador.foto}`);
    if (fotoBase64) {
      doc.addImage(fotoBase64, "PNG", 160, 43, 36, 36);
    }
  } else {
    doc.setDrawColor(230, 230, 230);
    doc.rect(160, 43, 36, 36);
  }

  let y = 50;
  doc.setTextColor(...darkGray);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(jogador.nome.toUpperCase(), 14, y);
  y += 7;

  doc.setFontSize(12);
  doc.setTextColor(...primaryRGB);
  const displayPos = jogador.posicao_principal?.nome ?? "POSIÇÃO NÃO INFORMADA";
  const displayNick = jogador.apelido ? ` (${jogador.apelido.toUpperCase()})` : "";
  doc.text(`${displayPos}${displayNick}`, 14, y);
  y += 7;

  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.setFont("helvetica", "normal");

  const naturalidade = [jogador.cidade?.nome, jogador.estado?.uf, jogador.pais?.nome].filter(Boolean).join(", ");
  const infoLines = [
    `Nome na camisa: ${jogador.nome_curto ?? "-"}  |  Apelido: ${jogador.apelido ?? "-"}`,
    `Idade: ${jogador.data_nascimento ? calcAge(jogador.data_nascimento) : "-"} anos  |  Data nasc.: ${jogador.data_nascimento ? formatDate(jogador.data_nascimento) : "-"}`,
    `Altura: ${jogador.altura ?? "-"}m  |  Peso: ${jogador.peso ?? "-"}kg`,
    `Naturalidade: ${naturalidade || "-"}`
  ];

  infoLines.forEach(line => {
    doc.text(line, 14, y);
    y += 4.5;
  });

  y += 3;
  doc.setDrawColor(240, 240, 240);
  doc.line(14, y, 196, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkGray);
  doc.setFontSize(10);
  doc.text("ANÁLISE TÉCNICA", 14, y);
  y += 6;

  const fieldH = 45;
  const campoImg = await getBase64ImageFromUrl(`${API_URL}/files/campo/campo_${jogador.posicao_id}.png`);
  if (campoImg) {
    doc.addImage(campoImg, "PNG", 14, y, 60, fieldH);
    doc.setFontSize(7);
    doc.text("POSIÇÃO PRINCIPAL", 14, y + fieldH + 4);
  }

  const peImgPath = jogador.pe_dominante === "D" ? "pe_direito.png" : "pe_esquerdo.png";
  const peImg = await getBase64ImageFromUrl(`${API_URL}/files/ambidestria/${peImgPath}`);
  if (peImg && jogador.pe_dominante !== "A") {
    doc.addImage(peImg, "PNG", 88, y + 8, 28, 28);
    doc.setFontSize(7);
    doc.text(`PÉ: ${jogador.pe_dominante === "D" ? "DESTRO" : "CANHOTO"}`, 88, y + fieldH + 4);
  } else if (jogador.pe_dominante === "A") {
    doc.text("AMBIDESTRO", 88, y + 22);
  }

  if (jogador.posicao_secundaria_id) {
    const campoSecImg = await getBase64ImageFromUrl(`${API_URL}/files/campo/campo_${jogador.posicao_secundaria_id}.png`);
    if (campoSecImg) {
      doc.addImage(campoSecImg, "PNG", 136, y, 60, fieldH);
      doc.setFontSize(7);
      doc.text("POSIÇÃO SECUNDÁRIA", 136, y + fieldH + 4);
    }
  }

  y += fieldH + 12;

  if (jogador.caracteristicas && jogador.caracteristicas.length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("ATRIBUTOS EM DESTAQUE", 14, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const chars = jogador.caracteristicas.map((c: any) => {
      const { descricao, nota } = parseCharacteristic(c.descricao);
      return `${descricao.toUpperCase()} (${nota})`;
    }).join("  •  ");
    const splitChars = doc.splitTextToSize(chars, 180);
    doc.text(splitChars, 14, y);
    y += (splitChars.length * 4) + 6;
  }

  const stats = jogador.estatisticas_gerais;
  if (stats && stats.length > 0) {
    const filteredStats = options.temporada
      ? stats.filter((s: any) => s.temporada === options.temporada)
      : stats;

    const totais = filteredStats.reduce((acc: any, curr: any) => ({
      j: acc.j + (curr.partidas_jogadas || 0),
      g: acc.g + (curr.gols || 0),
      a: acc.a + (curr.assistencias || 0),
      f: acc.f + (curr.faltas_cometidas || 0),
      ca: acc.ca + (curr.cartoes_amarelos || 0),
      cv: acc.cv + (curr.cartoes_vermelhos || 0),
    }), { j: 0, g: 0, a: 0, f: 0, ca: 0, cv: 0 });

    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("DESEMPENHO CONSOLIDADO" + (options.temporada ? ` (${options.temporada})` : ""), 14, y);
    autoTable(doc, {
      startY: y + 3,
      head: [["Jogos", "Gols", "Assists", "Faltas", "Amarelos", "Vermelhos"]],
      body: [[totais.j, totais.g, totais.a, totais.f, totais.ca, totais.cv]],
      theme: "striped",
      headStyles: { fillColor: primaryRGB, halign: "center" },
      styles: { fontSize: 8, halign: "center", cellPadding: 2 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  if (jogador.historico_clubes && jogador.historico_clubes.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    const historyWithImages = await Promise.all(jogador.historico_clubes.map(async (h: any) => {
      const flagUrl = h.clube?.pais?.bandeira?.logo_bandeira ? `${API_URL}/files/${h.clube.pais.bandeira.logo_bandeira}` : null;
      const logoUrl = h.clube?.logos?.[0]?.url_logo ? `${API_URL}/files/${h.clube.logos[0].url_logo}` : null;
      const [fImg, lImg] = await Promise.all([flagUrl ? getBase64ImageFromUrl(flagUrl) : null, logoUrl ? getBase64ImageFromUrl(logoUrl) : null]);
      return { ...h, fImg, lImg };
    }));
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("TRAJETÓRIA PROFISSIONAL", 14, y);
    autoTable(doc, {
      startY: y + 3,
      head: [["", "Clube", "", "Entrada", "Saída", "Cat.", "Jogos"]],
      body: historyWithImages.map(h => ["", h.clube?.nome ?? "-", "", h.data_entrada, h.data_saida ?? "Atual", h.categoria, h.jogos]),
      headStyles: { fillColor: secondaryRGB },
      styles: { fontSize: 8, cellPadding: 2 },
      didDrawCell: (data) => {
        if (data.section === 'body') {
          const row = historyWithImages[data.row.index];
          if (data.column.index === 0 && row.lImg) doc.addImage(row.lImg, 'PNG', data.cell.x + 1, data.cell.y + 0.5, 5, 5);
          if (data.column.index === 2 && row.fImg) doc.addImage(row.fImg, 'PNG', data.cell.x + 1, data.cell.y + 1.5, 5, 3);
        }
      }
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  if (jogador.titulos && jogador.titulos.length > 0) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PALMARÉS (TÍTULOS)", 14, y);
    autoTable(doc, {
      startY: y + 3,
      head: [["Ano", "Título", "Clube"]],
      body: jogador.titulos.map((t: any) => [t.ano, t.titulo?.nome, t.clube?.nome]),
      headStyles: { fillColor: [218, 165, 32] },
      styles: { fontSize: 8, cellPadding: 2 },
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  if (jogador.lesoes && jogador.lesoes.length > 0) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 0, 0);
    doc.text("DEPARTAMENTO MÉDICO", 14, y);
    doc.setTextColor(...darkGray);
    autoTable(doc, {
      startY: y + 3,
      head: [["Tipo", "Início", "Retorno", "Notas"]],
      body: jogador.lesoes.map((l: any) => [l.tipo_lesao, formatDate(l.data_inicio), l.data_retorno ? formatDate(l.data_retorno) : "EM RECUPERAÇÃO", l.descricao ?? "-"]),
      headStyles: { fillColor: [200, 0, 0] },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: { 3: { cellWidth: 70 } }
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  if (jogador.observacoes) {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVAÇÕES DO ANALISTA", 14, y);
    y += 5;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    const splitObs = doc.splitTextToSize(jogador.observacoes, 182);
    doc.text(splitObs, 14, y);
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text(`Página ${i} de ${pageCount} | Seleção de Atletas Pro`, 105, 292, { align: "center" });
  }

  doc.save(`SCOUT_${jogador.nome.replace(/\s+/g, "_").toUpperCase()}.pdf`);
}