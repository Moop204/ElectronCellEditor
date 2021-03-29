interface IModelProperties {
    name: string; 
    children: {
        components: {
            name: String; 
            index: number; 
        }[];        
        units:{
            name: String;
            index: number;
        }[];// Units[];
    }
}

export { IModelProperties };