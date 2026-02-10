const CONVERSION_RATE = 134.5; // $1 = NPR 134.5

export const formatUSD = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatNPR = (amount) => {
    const nprAmount = amount * CONVERSION_RATE;
    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 0,
    }).format(nprAmount);
};
