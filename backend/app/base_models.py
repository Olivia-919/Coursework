class Dict(dict):
    # __setattr__ = dict.__setitem__
    # __getattr__ = dict.__getitem__

    # def dictToObj(o):
    #     if not isinstance(o, dict):
    #         return o
    #     d = Dict()
    #     for k, v in o.items():
    #         d[k] = dictToObj(v)
    #     return d

    def __getattr__(self, key):
        return self.get(key)

    def __setattr__(self, key, value):
        self[key] = value
