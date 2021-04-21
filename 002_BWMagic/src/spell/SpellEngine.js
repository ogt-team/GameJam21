let SpellEngine = {

    castSpell: null,
    lastGesture: null,

    userCastSpell: function () {
        return SpellEngine.castSpell != null;
    },

    checkSpell: function (gesture){

        SpellEngine.lastGesture = gesture;
        SpellEngine.castSpell = null;

        for (let i = 0; i < spells.length; i++) {
            const spell = spells[i];

            if(spell.isValid(gesture)) {
                SpellEngine.castSpell = spell;
            }
        }
    }
}