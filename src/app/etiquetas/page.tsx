"use client";

import React, { useCallback, useRef, useState } from "react";
import { TbFileTypeZip } from "react-icons/tb";
import { MdFileDownload, MdError } from "react-icons/md";
import { BiSpreadsheet } from "react-icons/bi";
import { read, utils, writeFile } from "xlsx";
import { toast } from "sonner";
import { format } from "date-fns";
import axios from "axios";

import { amount, cepMask, phoneMask } from "@/shared/lib/strings";
import type { Order, Trader } from "@/shared/lib/pdf/types";
import { delay } from "@/shared/lib/delay";
import { DownloadZipFile } from "@/shared/lib/zip";
import { createContent } from "@/shared/lib/pdf/cupons/createContent";
import { createCuponPDF } from "@/shared/lib/pdf/cupons/pdf";
import { createPDFEtiquetas } from "@/shared/lib/pdf/etiquetas/createPDFEtiquetas";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

enum FILE_SUBTYPES {
  XLSX = "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}

interface OrderList {
  [key: string]: Order;
}

const trader: Trader = {
  name: "Kefir Brasil",
  phone: "(85) 99988-7766",
  site: "www.lojakefirbr.com",
};

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [haveFile, setHaveFile] = useState<boolean>(false);
  const [formatedData, setFormatedData] = useState<string[][]>();
  const [fileName, setFileName] = useState<string>();
  const [formatedDataForPDFs, setFormatedDataForPDFs] = useState<OrderList>();
  const [etiquetasZip, setEtiquetasZip] = useState<DownloadZipFile>();
  const [cuponsZip, setCuponsZip] = useState<DownloadZipFile>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rementente, setRementente] = useState<string>("Verônica Rodrigues");
  const [refEtiquetas, setRefEtiquetas] = useState<number>(0);
  const [refInitialEtiquetas, setRefInitialEtiquetas] = useState<number>(0);

  const handleCupom = useCallback(async (orderList: OrderList) => {
    const zip = new DownloadZipFile(
      `cupons-${format(new Date(), "dd-MM-yyyy")}.zip`
    );

    const response = await axios.get("logo.png", {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(response.data, "utf-8");

    for (const [key, value] of Object.entries(orderList)) {
      const content = await createContent({
        client: value.client,
        order: value,
        trader,
      });

      const pdf = await createCuponPDF(content, imageBuffer);
      zip.addFile(`${key}.pdf`, pdf);
    }

    setCuponsZip(zip);
  }, []);

  const handleEtiquetas = useCallback(
    async (data: string[][]) => {
      const currentZip = new DownloadZipFile(
        `etiquestas-${format(new Date(), "dd-MM-yyyy")}.zip`
      );

      for (const curr of data) {
        const [
          orderId,
          nome,
          cep,
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
        ] = curr;
        const file = `${orderId}.pdf`;
        const currObj = {
          nome: nome ? String(nome).trim() : "",
          cep: cep ? String(cep).trim() : "",
          logradouro: logradouro ? String(logradouro).trim() : "",
          numero: numero ? String(numero).trim() : "",
          complemento: complemento ? String(complemento).trim() : "",
          bairro: bairro ? String(bairro).trim() : "",
          cidade: cidade ? String(cidade).trim() : "",
          estado: estado ? String(estado).trim() : "",
        };

        const pdf = await createPDFEtiquetas(
          currObj,
          rementente,
          refInitialEtiquetas,
          refEtiquetas
        );

        await currentZip.addFile(file, pdf);
      }

      setEtiquetasZip(currentZip);
    },
    [rementente, refEtiquetas, refInitialEtiquetas]
  );

  const handleFormatData = useCallback(
    async (data: string[]) => {
      const formatedData: string[][] = [];
      const formatedDataCorreios: string[][] = [];
      const formatedDataWithStatus: string[][] = [];
      let currentOrder: Order;
      const orders: OrderList = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.forEach((value: any) => {
        const status = value[2];
        const nome = value[4];
        const logradouro = value[9];
        const numero = value[10];
        const complemento = value[11];
        const bairro = value[12];
        const cidade = value[13];
        const estado = value[14];
        const cep = cepMask(value[16]);

        const orderId = Number(value[0]);
        // const frete = amount(value[17]);
        // const subtotal = amount(value[18]);
        const discount = amount(value[19]);
        const paymentMethod = value[26];

        const idProd = Number(value[20]);
        const nomeProd = value[21];
        const valorProd = amount(value[22]);
        const qtdeProd = value[23];

        const nomeClient = value[4];
        const addressClient = `${value[9]} ${value[10]}, ${
          value[11] ? value[11] : ""
        }, ${value[12]}, ${value[13]} - ${value[14]} ${cepMask(value[16])}`;
        const phoneClient = phoneMask(value[7]);

        if (status === "Aguardando envio") {
          if (currentOrder?.id === orderId) {
            currentOrder.subtotal += valorProd + discount;
            currentOrder.total += valorProd + discount;
            currentOrder.products.push({
              id: idProd,
              name: nomeProd,
              amount: valorProd + discount,
              quantity: qtdeProd,
            });
          } else {
            currentOrder = {
              id: orderId,
              discount,
              paymentMethod,
              client: {
                name: nomeClient,
                address: addressClient,
                phone: phoneClient,
              },
              total: amount(String(valorProd + discount)),
              subtotal: amount(String(valorProd + discount)),
              products: [
                {
                  id: idProd,
                  name: nomeProd,
                  amount: valorProd + discount,
                  quantity: qtdeProd,
                },
              ],
            };
          }
          orders[orderId] = currentOrder;

          formatedData.push([
            nome,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
          ]);
          formatedDataCorreios.push([
            orderId,
            nome,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
          ]);
          formatedDataWithStatus.push([
            status,
            nome,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
          ]);
        }
      });

      await delay(1000);
      setLoading(false);
      setFormatedData(formatedData);
      setFormatedDataForPDFs(orders);

      await handleEtiquetas(formatedDataCorreios);
      await handleCupom(orders);
    },
    [handleEtiquetas, handleCupom]
  );

  const handleFileUpload = () => {
    if (!inputRef.current || !inputRef.current.files) {
      return;
    }

    setLoading(true);
    const file = inputRef.current.files[0];
    const reader = new FileReader();

    setFileName(file.name);
    if (file) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reader.onload = function (e: any) {
        const data = e.target.result;
        const readedData = read(data, { type: "binary" });
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];

        const dataParse = utils.sheet_to_json(ws, { header: 1 }) as string[];
        handleFormatData(dataParse);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleValidateFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const subtype = file.type.split("/")[1];

      if (subtype !== FILE_SUBTYPES.XLSX) {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        toast.error(
          <>
            <MdError className="text-red-700" size={20} />
            <p className="text-md">
              Arquivo inválido. Selecione um arquivo .xlsx
            </p>
          </>,
          { duration: 5000 }
        );

        setHaveFile(false);
      } else {
        setHaveFile(true);
      }
    }
  };

  const handleDownloadFormatedFile = (data: string[][], fileName: string) => {
    const workbook = utils.book_new();
    const workSheet = utils.aoa_to_sheet(data);
    utils.book_append_sheet(workbook, workSheet, "SheetJS");
    writeFile(workbook, fileName);
  };

  const handleReset = () => {
    setLoading(false);
    setHaveFile(false);
    setFormatedData(undefined);
    setFormatedDataForPDFs(undefined);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex align-center justify-center flex-col h-[400px] w-[500px] p-5 border-2 border-blue-400">
        {loading && (
          <div className="h-full flex  flex-col items-center justify-center">
            <p className="text-xl mb-2 font-bold text-center">
              Formatando arquivo
            </p>

            <p className="text-sm text-center">
              Aguarde enquanto o arquivo {`"${fileName}"`} é formatado
            </p>
            <Spinner className="w-full h-16 mt-8" />
          </div>
        )}
        {!loading && !formatedData && (
          <div className="h-full">
            <p className="text-xl mb-2 font-bold text-center">
              Formatador de planilha
            </p>

            <p className="text-sm text-center">
              Adicione sua planilha para converter os dados dela no formato
              desejado
            </p>

            <div className="w-full mt-4">
              <label className="text-sm font-bold">Nome do remetente</label>
              <Input
                className="p-1"
                name="name"
                placeholder="Nome do remetente"
                value={rementente}
                onChange={(e) => setRementente(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-full">
                <label className="text-sm font-bold">
                  Distancia extra no inicio
                </label>
                <Input
                  className="p-1"
                  name="dist"
                  type="number"
                  placeholder="Distancia extra no inicio por arquivo"
                  value={refInitialEtiquetas}
                  onChange={(e) => setRefInitialEtiquetas(+e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="text-sm font-bold">
                  Distancia extra entre etiquetas
                </label>
                <Input
                  className="p-1"
                  name="dist"
                  type="number"
                  placeholder="Distancia extra entre etiquetas"
                  value={refEtiquetas}
                  onChange={(e) => setRefEtiquetas(+e.target.value)}
                />
              </div>
            </div>

            <div className="mt-2">
              <label className="text-sm font-bold">Selecione o arquivo</label>
              <Input
                className="p-1 cursor-pointer"
                type="file"
                name="file"
                accept=".xlsx"
                multiple={false}
                ref={inputRef}
                onChange={handleValidateFile}
              />
            </div>

            <Button
              className="mt-8 bg-blue-700 w-full"
              disabled={!haveFile}
              onClick={handleFileUpload}
            >
              Formatar arquivo <BiSpreadsheet className="ml-1" size={15} />
            </Button>
          </div>
        )}
        {!!formatedData && !!formatedDataForPDFs && !loading && (
          <>
            <div className="h-1/4">
              <p className="text-xl mb-2 font-bold text-center">
                Processo concluído!
              </p>
              <p className="text-sm text-center">
                Planilha formatada com sucesso e PDFs gerados com sucesso!
              </p>
            </div>

            <Button
              onClick={() =>
                formatedData &&
                handleDownloadFormatedFile(
                  formatedData,
                  "ped-aguard-envio.xlsx"
                )
              }
              className="mt-2 bg-blue-700"
            >
              Baixar planilha para importação{" "}
              <MdFileDownload className="ml-1" size={15} />
            </Button>

            <Button
              onClick={async () => {
                if (!cuponsZip) return;
                await cuponsZip.download();
              }}
              className="mt-2 bg-blue-700 w-full h-9"
            >
              Baixar .zip com Cupons Fiscais em PDF{" "}
              <TbFileTypeZip className="ml-1" size={15} />
            </Button>

            <Button
              onClick={async () => {
                if (!etiquetasZip) return;
                await etiquetasZip.download();
              }}
              className="mt-2 bg-blue-700"
            >
              Baixar .zip com Etiquetas em PDF{" "}
              <TbFileTypeZip className="ml-1" size={15} />
            </Button>

            <p
              className="text-sm text-center mt-6 underline cursor-pointer transition-all duration-200 font-bold hover:text-blue-500"
              onClick={handleReset}
            >
              Voltar
            </p>
          </>
        )}
      </div>
    </div>
  );
}
