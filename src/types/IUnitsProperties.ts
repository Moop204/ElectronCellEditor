interface IUnitsProperties {
    name: string; 
    children: {
        unit: {
            reference: string; 
            prefix: string;
            exponent: number;
            multiplier: number;  
        }[];        
    }
}

export { IUnitsProperties };