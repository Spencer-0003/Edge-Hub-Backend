--This crack no longer works in newer versions of Edge as I helped ICEE patch it but this crack will work on this backend.

shared.whitelistkey = "Edge do be kinda cracked though :flushed:";

local function craccNumberGen(a, b)
    local a1, a2 = 48718057, 58305628;
    local b1, b2 = 108466472, 1090878788885;
    local x1, x2 = a, b;

    local r1 = (x2 * a2);
    local r2 = (x1 * a2 + x2 * a1) % b1;
    r2 = (r2 * b1 + r2) % b2;
    
    x1 = math.floor(r2 / b1);
    x2 = r2 - x1 * b1;

    return math.floor(((r2 / b2) * math.pow(10, 12)) + 0.5);
end;

local requestHook = syn.request;
setreadonly(syn, false);
syn.request = function(tbl)
    local url = tbl.Url;

    if (url == "https://icee.xyz/edge/OEFGIpnzyCNtwg7scItD") then
        local spoof = string.format("%.8s", os.time()):split("");

        local epicHashSpoof = syn.crypt.custom.hash("sha256", shared.whitelistkey .. craccNumberGen(spoof[6], spoof[7]));

        return {Body = epicHashSpoof}; -- very epic spoof
    end;

    if (url == "https://icee.xyz/edge/VFuQNPePYVy9dubewfCA") then
        return {Body = "false"}; -- anti kill switch
    end;

    if (url == "https://icee.xyz/zveC8DG4Un9iWcReG0Aeoollpa.json") then
        return {Body = game:GetService("HttpService"):JSONEncode({
            ok = "getgenv()";
            ok2 = "shared";
            ok3 = "whitelistkey";
            LOXBXwHZtG8mk913kFpS = "Players";
            asd = "GO RAPTORS";
        })}; -- anti kill switch pt2
    end;

    if (url == "https://icee.xyz/edge/egLOmhbVmCk5ABmN8DN7") then
        return {Body = "don't try touch my nudes"}; -- anti IP log for using dex
    end;

    return requestHook(tbl);
end;
setreadonly(syn, true);

-- Although I have a version of Edge that this will work on, I won't include it for obvious reasons.
