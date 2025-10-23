export const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

export const calculatePrice = (price: string | number, exchangePrice: string | number, type: string = 'exchange', coinSymbol: string = '$') => {
    if(type == 'exchange') return (parseFloat(price)*parseFloat(exchangePrice)).toFixed(2)+' Bs';
    return (parseFloat(price)/parseFloat(exchangePrice)).toFixed(2)+' '+coinSymbol;
};

/**
 * Formatea una fecha de YYYY-MM-DD a DD/MM/YYYY
 * @param dateString Fecha en formato YYYY-MM-DD
 * @returns Fecha formateada en DD/MM/YYYY o string vacío si es inválida
 */
export const formatDateToDDMMYYYY = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    
    try {
        const [year, month, day] = dateString.split('-');
        if (year && month && day) {
            return `${day}/${month}/${year}`;
        }
    } catch (error) {
        console.error('Error formateando fecha:', dateString, error);
    }
    return '';
};