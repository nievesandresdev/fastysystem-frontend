export const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

export const calculatePrice = (price: string | number, exchangePrice: string | number, type: string = 'exchange', coinSymbol: string = '$') => {
    if(type == 'exchange') return (parseFloat(price)*parseFloat(exchangePrice)).toFixed(2)+' Bs';
    return (parseFloat(price)/parseFloat(exchangePrice)).toFixed(2)+' '+coinSymbol;
};