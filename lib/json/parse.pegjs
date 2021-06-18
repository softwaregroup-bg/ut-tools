// https://github.com/pegjs/pegjs/blob/b7b87ea8aeeaa1caf096e2da99fd95a971890ca1/examples/json.pegjs

JSONText
  = ws token:value ws {
    return token
  }

BeginArray     = ws "[" ws
BeginObject    = ws "{" ws
EndArray       = ws "]" ws
EndObject      = ws "}" ws
NameSeparator  = ws ":" ws
ValueSeparator = ws "," ws

ws "whitespace" = [ \t\n\r]*

// ----- 3. Values -----

value
  = false
  / null
  / true
  / object
  / array
  / number
  / x: string {return {value: x, location: location()}}

false = "false" { return false; }
null  = "null"  { return null;  }
true  = "true"  { return true;  }

// ----- 4. Objects -----

object
  = BeginObject
    members:(
      head:member
      tail:(ValueSeparator m:member { return m; })*
      {
        var result = {};

        [head].concat(tail).forEach(function(element) {
          if (element.value && element.value.location) {
            result[element.name] = element.value.value;
            result[element.name + '$location'] = element.value.location;
          } else {
            result[element.name] = element.value;
          }
        });

        return result;
      }
    )?
    EndObject
    { return members !== null ? members: {}; }

member
  = name:string NameSeparator value:value {
      return { name: name, value: value };
    }

// ----- 5. Arrays -----

array
  = BeginArray
    values:(
      head:value
      tail:(ValueSeparator v:value { return v; })*
      { return [head].concat(tail); }
    )?
    EndArray
    { return values !== null ? values : []; }

// ----- 6. Numbers -----

number "number"
  = minus? int frac? exp? { return parseFloat(text()); }

DecimalPoint
  = "."

Digit19
  = [1-9]

e
  = [eE]

exp
  = e (minus / plus)? DIGIT+

frac
  = DecimalPoint DIGIT+

int
  = zero / (Digit19 DIGIT*)

minus
  = "-"

plus
  = "+"

zero
  = "0"

// ----- 7. Strings -----

string "string"
  = QuotationMark chars:char* QuotationMark { return chars.join(""); }

char
  = unescaped
  / escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence; }

escape
  = "\\"

QuotationMark
  = '"'

unescaped
  = [^\0-\x1F\x22\x5C]

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i
