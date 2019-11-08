const bodyParser = require("body-parser");
const express = require("express");
const cors = require('cors');
const app = express();

const keystone = require('.');
let ks, assembly, result;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.post('/api', (req, res) => {
    const code = req.body.code;
    
    console.log(`POST request: code is { ${code} }`);
    let ans = execute2(JSON.parse(code));
    console.log(ans);
    res.end(ans);
});

app.listen(3000, () => {
    console.log("Started on http://localhost:3000");
});

let execute2 = function(code)
{
    console.log("Executing Keystone");
    if(! keystone.is_arch_supported(keystone.ARCH_X86))
    {
        console.log("Warning: X86 architecture not supported by keystone");
    }

    ks = new keystone.Ks(keystone.ARCH_X86, keystone.MODE_64);
    // Assemble some instructions
    let i = 0;
    assembly = code[i];
    console.log("Assembly: \"" + assembly + "\"");
    try{
        result = ks.asm(assembly);
        console.log("Results: " + result.encoding.toString());
        console.log("Hex: " + result.encoding.toString('hex'));
        return result.encoding.toString('hex');
    }
    catch(err)
    {
        console.log("Error: " + err.message);
    }
    console.log("Exiting Keystone");
    return '';
};

let execute = function()
{
    console.log("Executing Keystone");
    if(! keystone.is_arch_supported(keystone.ARCH_X86))
    {
        console.log("Warning: X86 architecture not supported by keystone");
    }

    ks = new keystone.Ks(keystone.ARCH_X86, keystone.MODE_64);

    // Assemble some instructions
    assembly = 'inc rcx; dec rbx';
    try{
        result = ks.asm(assembly);
        console.log('"' + assembly + '"', ':', result.encoding);
        console.log('Hex: ' + result.encoding.toString('hex'));
        return result.encoding.toString('hex');
    }
    catch(err)
    {
        console.log("Error: " + err.message);
    }
    
    console.log("End Keystone");
};