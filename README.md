# Electron Cell(ML) Editor

A GUI editor for the [CellML language](https://www.cellml.org/)

## Download Now!
Release is available [here](https://github.com/Moop204/ElectronCellEditor/releases/tag/v1.0.0)

## How to Build

Clone this repo  

```
git clone https://github.com/Moop204/ElectronCellEditor
```

Run yarn inside the root folder to install required packages.  

```
cd ElectronCellEditor
yarn
```

After the packages are downloaded you can now either:

### Run the Application

```
yarn start
```

### Build the Application
Package the application locally and then move to the out folder where the application is built. By default it packages to your device's platform. 

```
yarn package
cd out
```

Find the binary for your system and then execute it.

## Note
Currently this application relies on an in-dev version of libcellml. Until they fully release their javascript port that contains the features this application relies, that version of libcellml is precompiled on a Linux device and located in 'src/backend/mainLibcellml'. This may not work on other operating systems and require you to build the libcellml library yourself.