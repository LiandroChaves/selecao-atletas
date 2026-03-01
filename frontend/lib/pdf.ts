import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Jogador, PDFOptions } from "@/types";
import { calcAge, formatDate, API_URL } from "./utils";

// Função auxiliar para carregar imagens e converter para Base64
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

// Função auxiliar para converter Hex para RGB
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

  // 1. HEADER BAR
  doc.setFillColor(...primaryRGB);
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);

  let textX = 14;

  // 1.1 LOGO DO CLUBE NO CANTO SUPERIOR ESQUERDO
  if (options.clube_id) {
    const clube = jogador.clube_atual_id === options.clube_id
      ? jogador.clube_atual
      : jogador.historico_clubes?.find(h => h.clube_id === options.clube_id)?.clube;

    const logoUrl = clube?.logos?.[0]?.url_logo;
    if (logoUrl) {
      const logoBase64 = await getBase64ImageFromUrl(`${API_URL}/files/${logoUrl}`);
      if (logoBase64) {
        doc.addImage(logoBase64, "PNG", 10, 5, 30, 30);
        textX = 45; // Move o texto para a direita para não sobrepor a logo
      }
    }
  }

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`FICHA DO ATLETA - ${options.category.toUpperCase()}`, textX, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Relatório oficial gerado em ${new Date().toLocaleDateString("pt-BR")}`, textX, 28);

  // 2. PLAYER PHOTO (CIRCLE)
  let y = 55;
  if (jogador.foto) {
    const fotoBase64 = await getBase64ImageFromUrl(`${API_URL}/files/${jogador.foto}`);
    if (fotoBase64) {
      doc.addImage(fotoBase64, "PNG", 155, 45, 40, 40);
    }
  } else {
    doc.setDrawColor(200, 200, 200);
    doc.rect(155, 45, 40, 40);
    doc.text("SEM FOTO", 165, 65);
  }

  // 3. NAME AND BASIC INFO
  doc.setTextColor(...darkGray);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(jogador.nome.toUpperCase(), 14, y);
  y += 8;

  doc.setFontSize(14);
  doc.setTextColor(...primaryRGB);
  const displayPos = jogador.posicao_principal?.nome ?? "POSIÇÃO NÃO INFORMADA";
  const displayNick = jogador.apelido ? ` (${jogador.apelido.toUpperCase()})` : "";
  doc.text(`${displayPos}${displayNick}`, 14, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(...lightGray);
  doc.setFont("helvetica", "normal");

  const naturalidade = [
    jogador.cidade?.nome,
    jogador.estado?.uf,
    jogador.pais?.nome
  ].filter(Boolean).join(", ");

  const subInfo = [
    `Nome Curto: ${jogador.nome_curto ?? "-"}`,
    `Apelido: ${jogador.apelido ?? "-"}`,
    `Data nasc.: ${jogador.data_nascimento ? formatDate(jogador.data_nascimento) : "-"}`,
    `Idade: ${jogador.data_nascimento ? calcAge(jogador.data_nascimento) : "-"} anos`,
    `Altura: ${jogador.altura ?? "-"}m`,
    `Peso: ${jogador.peso ?? "-"}kg`,
    `Naturalidade: ${naturalidade || "-"}`
  ];

  // Quebrar em duas linhas se necessário
  doc.text(subInfo.slice(0, 3).join("  |  "), 14, y);
  y += 5;
  doc.text(subInfo.slice(3).join("  |  "), 14, y);
  y += 15;

  // 4. POSITIONAL ANALYSIS & FOOT
  doc.setDrawColor(230, 230, 230);
  doc.line(14, y, 196, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkGray);
  doc.text("ANÁLISE TÉCNICA DE POSICIONAMENTO", 14, y);
  y += 10;

  // Aumentar height das imagens de campo (era 60x40, agora 60x60 ou similar)
  const fieldHeight = 50;
  const campoImg = await getBase64ImageFromUrl(`${API_URL}/files/campo/campo_${jogador.posicao_id}.png`);
  if (campoImg) {
    doc.addImage(campoImg, "PNG", 14, y, 60, fieldHeight);
    doc.setFontSize(8);
    doc.text("POSIÇÃO PRINCIPAL", 14, y + fieldHeight + 5);
  }

  const peImgPath = jogador.pe_dominante === "D" ? "pe_direito.png" : "pe_esquerdo.png";
  const peImg = await getBase64ImageFromUrl(`${API_URL}/files/ambidestria/${peImgPath}`);
  if (peImg && jogador.pe_dominante !== "A") {
    doc.addImage(peImg, "PNG", 85, y + 10, 30, 30);
    doc.setFontSize(8);
    doc.text(`PÉ DOMINANTE: ${jogador.pe_dominante === "D" ? "DESTRO" : "CANHOTO"}`, 85, y + fieldHeight + 5);
  } else if (jogador.pe_dominante === "A") {
    doc.setFontSize(10);
    doc.text("AMBIDESTRO", 85, y + 25);
  }

  if (jogador.posicao_secundaria_id) {
    const campoSecImg = await getBase64ImageFromUrl(`${API_URL}/files/campo/campo_${jogador.posicao_secundaria_id}.png`);
    if (campoSecImg) {
      doc.addImage(campoSecImg, "PNG", 135, y, 60, fieldHeight);
      doc.setFontSize(8);
      doc.text("POSIÇÃO SECUNDÁRIA", 135, y + fieldHeight + 5);
    }
  }

  y += fieldHeight + 20;

  // 5. STATS TABLE
  const stats = jogador.estatisticas_gerais;
  if (stats) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DESEMPENHO CONSOLIDADO", 14, y);

    autoTable(doc, {
      startY: y + 5,
      head: [["Jogos", "Gols", "Assists", "Faltas", "Amarelos", "Vermelhos"]],
      body: [[
        stats.partidas_jogadas ?? 0,
        stats.gols ?? 0,
        stats.assistencias ?? 0,
        stats.faltas_cometidas ?? 0,
        stats.cartoes_amarelos ?? 0,
        stats.cartoes_vermelhos ?? 0,
      ]],
      theme: "striped",
      headStyles: { fillColor: primaryRGB, halign: "center" },
      columnStyles: {
        0: { halign: "center" }, 1: { halign: "center" }, 2: { halign: "center" },
        3: { halign: "center" }, 4: { halign: "center" }, 5: { halign: "center" }
      },
    });
    y = (doc as any).lastAutoTable.finalY + 15;
  }

  // 6. CLUB HISTORY
  if (jogador.historico_clubes && jogador.historico_clubes.length > 0) {
    // Pré-carregar imagens do histórico e ordenar
    const historyData = await Promise.all(jogador.historico_clubes.map(async (h) => {
      const flagUrl = (h.clube?.pais as any)?.bandeira?.logo_bandeira
        ? `${API_URL}/files/${(h.clube?.pais as any).bandeira.logo_bandeira}`
        : null;
      const logoUrl = h.clube?.logos?.[0]?.url_logo
        ? `${API_URL}/files/${h.clube.logos[0].url_logo}`
        : null;

      const [flagImg, logoImg] = await Promise.all([
        flagUrl ? getBase64ImageFromUrl(flagUrl) : Promise.resolve(null),
        logoUrl ? getBase64ImageFromUrl(logoUrl) : Promise.resolve(null)
      ]);

      return { ...h, flagImg, logoImg };
    }));

    // Ordenação: Ano Desc, depois Categoria (Profissional > Base > Amador)
    const categoryPriority: Record<string, number> = {
      "Profissional": 3,
      "Base": 2,
      "Amador": 1
    };

    historyData.sort((a, b) => {
      // Primeiro por ano (descendente)
      const yearA = a.data_entrada ?? 0;
      const yearB = b.data_entrada ?? 0;
      if (yearB !== yearA) return yearB - yearA;

      // Se o ano for igual, por categoria
      const prioA = categoryPriority[a.categoria ?? ""] ?? 0;
      const pripointB = categoryPriority[b.categoria ?? ""] ?? 0;
      return pripointB - prioA;
    });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TRAJETÓRIA PROFISSIONAL", 14, y);

    autoTable(doc, {
      startY: y + 5,
      head: [["", "Clube", "", "Entrada", "Saída", "Cat.", "Jogos"]],
      body: historyData.map((h) => [
        "",
        h.clube?.nome ?? "-",
        "",
        h.data_entrada ?? "-",
        h.data_saida ?? "Atual",
        h.categoria ?? "-",
        h.jogos ?? 0
      ]),
      headStyles: { fillColor: secondaryRGB },
      columnStyles: {
        0: { cellWidth: 6, halign: "right", cellPadding: { left: 0, right: 0.5, top: 2, bottom: 2 } },
        1: { cellWidth: "auto", halign: "left", cellPadding: { left: 0.5, right: 0.5, top: 2, bottom: 2 } },
        2: { cellWidth: 6, halign: "left", cellPadding: { left: 0.5, right: 0, top: 2, bottom: 2 } },
        6: { halign: "center" }
      },
      didDrawCell: (data) => {
        if (data.section === 'body') {
          const rowData = historyData[data.row.index];
          if (data.column.index === 0 && rowData.flagImg) {
            const imgW = 4;
            const imgH = 2.8;
            const x = data.cell.x + data.cell.width - imgW;
            const yOffset = (data.cell.height - imgH) / 2;
            doc.addImage(rowData.flagImg, 'PNG', x, data.cell.y + yOffset, imgW, imgH);
          }
          if (data.column.index === 2 && rowData.logoImg) {
            const imgSize = 4;
            const x = data.cell.x;
            const yOffset = (data.cell.height - imgSize) / 2;
            doc.addImage(rowData.logoImg, 'PNG', x, data.cell.y + yOffset, imgSize, imgSize);
          }
        }
      }
    });
    y = (doc as any).lastAutoTable.finalY + 15;
  }

  // 7. TITLES (Sorted by Year ASC)
  if (jogador.titulos && jogador.titulos.length > 0) {
    if (y > 230) { doc.addPage(); y = 20; }

    const titulosSorted = [...jogador.titulos].sort((a, b) => (a.ano ?? 0) - (b.ano ?? 0));

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("PALMARÉS (TÍTULOS)", 14, y);

    autoTable(doc, {
      startY: y + 5,
      head: [["Ano", "Título", "Clube"]],
      body: titulosSorted.map((t) => [t.ano ?? "-", t.titulo?.nome ?? "-", t.clube?.nome ?? "-"]),
      headStyles: { fillColor: [218, 165, 32] },
    });
    y = (doc as any).lastAutoTable.finalY + 15;
  }

  // 8. CARACTERÍSTICAS & OBSERVAÇÕES
  if ((jogador.caracteristicas && jogador.caracteristicas.length > 0) || jogador.observacoes) {
    if (y > 220) { doc.addPage(); y = 20; }

    // Sub-seção de Características
    if (jogador.caracteristicas && jogador.caracteristicas.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("CARACTERÍSTICAS EM DESTAQUE", 14, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const chars = jogador.caracteristicas
        .map(c => c.descricao.split(" |")[0].toUpperCase())
        .join("  •  ");

      const splitChars = doc.splitTextToSize(chars, 180);
      doc.text(splitChars, 14, y);
      y += (splitChars.length * 5) + 10;
    }

    // Sub-seção de Observações
    if (jogador.observacoes) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("OBSERVAÇÕES DO ANALISTA", 14, y);
      y += 7;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      const splitObs = doc.splitTextToSize(jogador.observacoes, 180);
      doc.text(splitObs, 14, y);
      y += (splitObs.length * 5) + 15;
    }
  }

  // 9. INJURIES (Departamento Médico)
  if (jogador.lesoes && jogador.lesoes.length > 0) {
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(200, 0, 0); // Vermelho para destaque médico
    doc.text("DEPARTAMENTO MÉDICO (HISTÓRICO)", 14, y);
    doc.setTextColor(...darkGray);

    autoTable(doc, {
      startY: y + 5,
      head: [["Tipo de Lesão", "Início", "Retorno", "Observações"]],
      body: jogador.lesoes.map((l) => [
        l.tipo_lesao ?? "-",
        l.data_inicio ? formatDate(l.data_inicio) : "-",
        l.data_retorno ? formatDate(l.data_retorno) : "EM RECUPERAÇÃO",
        l.descricao ?? "-"
      ]),
      headStyles: { fillColor: [200, 0, 0] },
      columnStyles: {
        3: { cellWidth: 80 }
      }
    });
  }

  // FOOTER
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página ${i} de ${pageCount} | Seleção de Atletas Pro`, 105, 290, { align: "center" });
  }

  doc.save(`SCOUT_${jogador.nome.replace(/\s+/g, "_").toUpperCase()}.pdf`);
}