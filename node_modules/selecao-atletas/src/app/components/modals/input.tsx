import { useEffect, useState } from "react";
import { InputMask } from "@react-input/mask"; // <-- CORRETO

interface DateInputProps {
    value: string;
    onChange: (newValue: string) => void;
    placeholder?: string;
}

const formatarParaInput = (valor: string) => {
    if (!valor) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        const [ano, mes, dia] = valor.split("-");
        return `${dia}-${mes}-${ano}`;
    }
    return valor;
};

const formatarParaValor = (valor: string) => {
    if (!valor) return "";
    if (/^\d{2}-\d{2}-\d{4}$/.test(valor)) {
        const [dia, mes, ano] = valor.split("-");
        return `${ano}-${mes}-${dia}`;
    }
    return valor;
};

export const DateInput = ({ value, onChange, placeholder }: DateInputProps) => {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        setInputValue(formatarParaInput(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const novoValor = e.target.value;
        setInputValue(novoValor);

        if (/^\d{2}-\d{2}-\d{4}$/.test(novoValor)) {
            onChange(formatarParaValor(novoValor));
        } else if (novoValor.replace(/[^0-9]/g, "").length === 0) {
            onChange("");
        }
    };

    return (
        <InputMask
            mask="dd-dd-dddd"
            replacement={{ d: /\d/ }}
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder || "dd-mm-aaaa"}
            className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
        />
    );
};
