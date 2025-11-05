# Moore Machine simulation for Lab 2

# Transition table: {state: {input: next_state}}
transitions = {
    "A1": {"0": "A1", "1": "B2"},
    "B1": {"0": "C1", "1": "D2"},
    "C1": {"0": "D2", "1": "B2"},
    "D1": {"0": "B2", "1": "C1"},
    "E1": {"0": "D2", "1": "E1"},
}

# State outputs
outputs = {
    "A1": "A",
    "B1": "A",
    "C1": "C",
    "D1": "B",
    "E1": "C",
    "B2": "B",
    "D2": "C"
}

def moore_machine(input_string):
    state = "A1"
    result = [outputs[state]]  # initial output
    for symbol in input_string:
        if symbol not in ("0", "1"):
            continue
        state = transitions.get(state, {}).get(symbol, state)
        result.append(outputs.get(state, ""))
    return "".join(result)

# Test inputs
inputs = ["00110", "11001", "1010110", "101111"]

for s in inputs:
    print(f"Input: {s} -> Output: {moore_machine(s)}")
