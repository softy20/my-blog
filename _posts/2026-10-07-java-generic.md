# [Java] 제네릭(Generic) 정리: 수업 듣다가 궁금했던 것들

> 오늘 수업에서 제네릭을 배웠다. 개념만 정리하면 다른 글과 다를 게 없을 것 같아서, **수업 중에 실제로 막혔던 질문과 그 답**을 중심으로 정리했다. 개념 흐름을 따라가다가 질문이 생겼던 지점마다 `❓ Q.`로 표시해 두었다.
>
> **이 글에 담긴 질문**
> 1. 데이터 타입과 참조 자료형은 같은 말일까?
> 2. 제네릭을 쓰는 이유가 뭘까? 일반 클래스와 다른 점이 없어 보이는데?
> 3. `T`는 뭘까? 그냥 제네릭 변수일까?
> 4. `List<E>`는 배열과 같은 걸까?
> 5. 자식 클래스와 하위 클래스는 같은 말일까?
> 6. 기본 생성자와 매개변수 생성자를 왜 따로 만들었을까?
> 7. `new RabbitFarm<Rabbit>(new Rabbit())`는 어떤 생성자를 쓴 걸까? 깔끔하게 쓰면?

---

## 1. Object란 무엇인가

- 자바의 **모든 클래스의 최상위 부모**이다. 따로 `extends`를 쓰지 않아도 모든 클래스는 `Object`를 상속받는다.
- `Object` 타입 변수에는 **어떤 값이든 담을 수 있다.**
- 하지만 컴파일러의 눈에는 담긴 값이 그저 `Object`로만 보인다. 그래서 **꺼낼 때 형변환이 필요하다.**

```java
Object obj = "안녕하세요";

String s1 = obj;            // 컴파일 오류: Object를 String에 바로 담을 수 없다
String s2 = (String) obj;   // 형변환하면 정상
Integer n = (Integer) obj;  // 컴파일은 통과하지만, 실행하면 ClassCastException
```

마지막 줄이 핵심이다. 형변환을 잘못 써도 **컴파일 단계에서는 오류가 검출되지 않고, 실행 단계에서 ClassCastException이 발생한다.**

---

## 2. 컴파일 오류를 확인해야 하는 이유

"오류가 없는 게 좋다"가 아니라, **오류를 실행하기 전에 발견할 수 있는 게 좋다**는 것이 핵심이다.

| 구분 | 발견 시점 | 특징 |
|---|---|---|
| 컴파일 오류 | 코드를 작성하고 컴파일할 때 | 빨간 줄로 어디가 문제인지 바로 알 수 있다 |
| 런타임 오류 | 프로그램을 실행하는 도중 | 특정 상황에서만 터져서 찾기 어렵고, 서비스 중에 발생할 수 있다 |

제네릭은 앞의 `ClassCastException` 같은 **런타임 오류를 컴파일 오류로 앞당겨 주는 도구**이다.

---

## 3. 제네릭이란

**데이터 타입(자료형)을 일반화**하는 문법이다. 클래스를 만들 때 내부에서 쓸 타입을 확정하지 않고, **사용하는 시점(컴파일 시점)에 타입을 지정**한다. 컴파일러가 그 타입을 기준으로 미리 검사해 주기 때문에 타입 안정성이 높아진다.

```java
public class GenericTest<T> {

    private T value;

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "GenericTest{" +
                "value=" + value +
                '}';
    }
}
```

클래스 이름 뒤의 `<T>`가 제네릭 선언이고, `T`는 나중에 정해질 타입을 대신하는 이름이다.

### 사용해 보기

```java
// 타입을 지정하지 않으면 Object처럼 동작한다 (경고 발생)
GenericTest gt = new GenericTest();
gt.setValue(1);
gt.setValue("안녕하세요");   // 숫자 다음에 문자열도 들어간다

// 타입을 지정하면 그 타입만 들어갈 수 있다
GenericTest<String> gt2 = new GenericTest<>();
gt2.setValue("문자열");
// gt2.setValue(1);          // 컴파일 오류: String만 가능
```

"아무 타입이나 쓸 수 있다"는 말은 **클래스를 만들 때는 타입이 열려 있다**는 뜻이다. 사용할 때 `<String>`처럼 지정하고 나면 **그 타입만** 받는다.

### getter / setter / toString

- **getter**: `private`으로 감춘 필드의 값을 외부에서 **조회**할 때 쓰는 메서드이다.
- **setter**: 필드의 값을 **설정(변경)**할 때 쓰는 메서드이다.
- 필드를 `private`으로 감추고 메서드로만 접근하게 하는 것을 **캡슐화**라고 한다.
- **toString()**: 클래스로 만든 변수는 참조 자료형이라, 그냥 출력하면 `클래스명@해시코드` 형태로 나온다. 주소값처럼 보이지만 정확히는 `Object`가 기본으로 제공하는 `toString()`의 결과이다. 이를 **오버라이드**하면 내부 값을 읽기 좋게 출력할 수 있다.

### ❓ Q1. 데이터 타입이 뭐지? 참조 자료형을 말하는 건가?

> 제네릭의 `<>` 안에는 기본 자료형을 쓸 수 없다고 해서, 자료형이 정확히 뭔지 헷갈렸다.

**A.** 데이터 타입과 자료형은 **같은 말**이고, 참조 자료형은 자료형의 **한 종류**이다. 자료형은 변수에 어떤 종류의 값을 담을지 정해 두는 분류이다.

```
자료형 (데이터 타입)
├─ 기본 자료형 (Primitive Type): 값 자체를 저장   → int, double, char, boolean 등 8개
└─ 참조 자료형 (Reference Type): 객체의 주소를 저장 → String, 배열, List, 직접 만든 클래스 등
```

```java
int x = 5;               // 기본형: 변수 안에 5가 직접 들어 있다
Car car = new Car();     // 참조형: 변수 안에는 Car 객체가 있는 주소가 들어 있다
```

제네릭의 `<>` 자리에는 **참조 자료형만** 들어갈 수 있다. 기본 자료형을 쓰고 싶으면 그것을 객체로 감싼 **래퍼(Wrapper) 클래스**를 사용한다.

| 기본 자료형 | 래퍼 클래스 |
|---|---|
| `byte` | `Byte` |
| `short` | `Short` |
| `int` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

```java
// GenericTest<int> gt3 = new GenericTest<int>();   // 컴파일 오류
GenericTest<Integer> gt3 = new GenericTest<>();     // 우항의 Integer는 생략 가능
gt3.setValue(1);                                     // int 값 1이 자동으로 Integer로 변환된다
```

---

## 4. 제네릭을 왜 쓰는가

### ❓ Q2. 제네릭을 쓰는 이유가 뭘까?

> `<>`로 타입을 지정해서 쓰는 거면 일반 클래스와 다른 점이 없는 것 같은데, 굳이 제네릭을 쓰는 이유가 무엇인가?

**A.** 제네릭 없이 같은 기능을 만드는 방법과 비교하면 이유가 보인다.

**방법 A. 타입마다 클래스를 따로 만든다**

```java
class IntegerBox { private Integer value; /* getter, setter */ }
class StringBox  { private String value;  /* getter, setter */ }
class DoubleBox  { private Double value;  /* getter, setter */ }
// 타입이 늘어날 때마다 똑같은 코드를 복사해야 한다
```

**방법 B. `Object` 하나로 만든다**

```java
class ObjectBox { private Object value; /* getter, setter */ }

ObjectBox box = new ObjectBox();
box.setValue("문자열");
Integer n = (Integer) box.getValue();   // 컴파일은 통과, 실행하면 ClassCastException
```

**방법 C. 제네릭으로 만든다**

```java
GenericTest<String> box = new GenericTest<>();
box.setValue("문자열");
String s = box.getValue();     // 형변환이 필요 없다
// box.setValue(1);            // 잘못된 타입은 컴파일 단계에서 막힌다
```

| | A. 타입별 클래스 | B. Object | C. 제네릭 |
|---|---|---|---|
| 클래스 개수 | 타입 수만큼 | 1개 | 1개 |
| 형변환 | 불필요 | **필요** | 불필요 |
| 타입 검사 | 컴파일 시점 | **실행 시점(위험)** | 컴파일 시점 |

결국 제네릭은 **A의 안전함(컴파일 검사)과 B의 재사용성(클래스 하나)을 동시에 얻는 방법**이다. 일반 클래스는 필드 타입이 `String`처럼 고정되거나 `Object`로 열어두는 수밖에 없지만, 제네릭은 **타입 자체를 매개변수처럼 받는다.** 이미 만들어 둔 제네릭 클래스를 **타입만 바꿔서 여러 번** 쓸 수 있다는 것이 제네릭의 쓰임이다.

> 참고: 수업에서는 `<>`를 "다이아몬드 연산자"라고 부르지만, 값을 계산하는 연산자가 아니라 **타입을 지정하는 문법**이다.

---

## 5. T는 무엇인가

### ❓ Q3. `T`는 뭘까? 그냥 제네릭 변수? 제네릭이라고 알려주는 표시?

> `private T animal;`에서 `animal`이 필드인 건 알겠는데, 그럼 `T`는 뭔지 모르겠다.

**A.** `T`는 **타입 변수(Type Parameter)** 이다. 값을 담는 변수가 아니라 **타입을 담는 변수**이다. 그리고 `<T>`는 "이 클래스는 타입을 하나 받는다. 그것을 `T`라고 부르겠다"는 선언이면서, 동시에 제네릭 클래스라는 표시이기도 하다. 즉 둘 다 맞다.

```java
public class GenericTest<T> {   // <T>: 타입 변수 T를 선언한다
    private T value;            // value의 타입은 T이다 (int age; 에서 int 자리에 T가 온 것)
}
```

메서드의 매개변수와 비교하면 이해하기 쉽다. **값을 `()`로 넘기듯, 타입을 `<>`로 넘기는 것**이다.

| | 값 | 타입 |
|---|---|---|
| 받는 쪽 (정의) | 매개변수 `String food` | 타입 변수 `T` |
| 넘기는 쪽 (호출) | 전달인자 `"당근"` | 타입 인자 `Bunny` |
| 넘기는 문법 | `()` | `<>` |

```java
GenericTest<String> a = new GenericTest<>();   // T = String
GenericTest<Integer> b = new GenericTest<>();  // T = Integer
```

`T`에 `Bunny`가 들어가면 클래스 안의 `T`가 전부 `Bunny`로 바뀐 것처럼 동작한다.

`T`는 Type의 약자이며 관례일 뿐 다른 글자를 써도 동작한다. 자주 쓰는 이름은 다음과 같다.

| 글자 | 의미 | 예 |
|---|---|---|
| `T` | Type | `GenericTest<T>` |
| `E` | Element (요소) | `List<E>` |
| `K`, `V` | Key, Value | `Map<K, V>` |

### ❓ Q4. 배열이 리스트 아닌가? `List<E>`는 뭐가 다를까?

> `list.size()`는 되는데 `list.length()`는 안 되는 걸 보고, 배열과 리스트를 같은 걸로 생각하고 있었다는 걸 알았다. 파이썬에서는 둘이 구분이 없었기 때문이다.

**A.** 자바에서 **배열과 리스트는 다르다.** `List<E>`는 앞에서 본 제네릭 클래스(정확히는 인터페이스)이고, 보통 `ArrayList`로 만든다.

| | 파이썬 list | 자바 배열 | 자바 List (ArrayList) |
|---|---|---|---|
| 선언 | `a = [1, 2, 3]` | `int[] a = {1, 2, 3};` | `List<Integer> a = new ArrayList<>();` |
| 크기 | 가변 | **고정** | 가변 |
| 타입 | 섞어서 가능 | 한 타입만 | 한 타입만 (제네릭으로 지정) |
| 추가 | `a.append(4)` | 불가 | `a.add(4)` |
| 접근 | `a[0]` | `a[0]` | `a.get(0)` |
| 개수 | `len(a)` | `a.length` | `a.size()` |
| 기본형 | 구분 없음 | `int` 직접 가능 | `Integer` 같은 래퍼 클래스만 |

파이썬의 `list`는 자바의 `ArrayList`에 가깝다. 파이썬은 고정 크기 배열을 따로 쓸 일이 거의 없어서 `list` 하나가 둘의 역할을 다 하지만, 자바는 **고정 크기 배열**과 **가변 크기 리스트**로 나눈다. 개수를 구하는 방법도 타입마다 다르다.

| 타입 | 개수 구하기 | 형태 |
|---|---|---|
| 배열 | `arr.length` | 필드 (괄호 없음) |
| String | `str.length()` | 메서드 |
| List, Set, Map | `list.size()` | 메서드 |

`List<Integer>`에서 `int`가 아니라 `Integer`를 쓰는 이유도 Q1에서 본 것처럼 제네릭에는 참조 자료형만 들어가기 때문이다.

---

## 6. 상속과 인터페이스

실습에서는 다음과 같은 클래스 구조를 사용했다.

```
Animal (인터페이스)
├─ Mammal (포유류)        implements Animal
│   └─ Rabbit             extends Mammal
│       └─ Bunny          extends Rabbit
│           └─ DrunkenBunny   extends Bunny
└─ Reptile (파충류)       implements Animal
    └─ Snake              extends Reptile
```

| | 상속 | 인터페이스 |
|---|---|---|
| 키워드 | `extends 클래스명` | `implements 인터페이스명` |
| 의미 | 부모의 필드와 메서드를 물려받는다 | 정해진 메서드를 구현하겠다는 약속이다 |
| 개수 | 클래스는 부모를 **하나만** | 인터페이스는 **여러 개** 구현 가능 |

참고로 인터페이스끼리 상속할 때는 `implements`가 아니라 `extends`를 쓴다.

### ❓ Q5. 자식 클래스와 하위 클래스는 같은 걸 가리키는 말일까?

**A.** 그렇다. 상속 관계를 부르는 이름이 여러 개일 뿐 **같은 대상**이다.

| 부모 쪽 | 자식 쪽 |
|---|---|
| 부모 클래스 (Parent) | 자식 클래스 (Child) |
| 상위 클래스 (Superclass) | 하위 클래스 (Subclass) |
| 슈퍼 클래스 | 서브 클래스 |
| 기반 클래스 (Base) | 파생 클래스 (Derived) |

`Bunny`는 `Rabbit`의 자식 클래스이자 하위 클래스이자 서브 클래스이다. 부모/자식은 가족에 빗댄 표현이고, 상위/하위, 슈퍼/서브는 계층 구조에 빗댄 표현이다. 아래 와일드카드의 `? extends`(하위)와 `? super`(상위)도 이 용어를 쓴다.

### 오버라이드와 `cry()`

```java
public class Rabbit extends Mammal {
    public void cry() { System.out.println("토기 우는 중. 끾끾"); }
}

public class Bunny extends Rabbit {
    @Override
    public void cry() { System.out.println("바니바니 당근당근"); }
}

public class DrunkenBunny extends Bunny {
    @Override
    public void cry() { System.out.println("ㅂ...ㄴ...ㅂ..ㄴ...나니...당...근..."); }
}
```

부모의 메서드를 같은 시그니처(이름과 매개변수)로 자식이 다시 정의하는 것이 **오버라이드**이다.

---

## 7. 타입 제한: `T extends Rabbit`

`<T>`만 쓰면 어떤 타입이든 들어올 수 있다. 토끼 농장에는 토끼 계열만 들어오게 하고 싶다면 `extends`로 범위를 제한한다.

```java
public class RabbitFarm<T extends Rabbit> {
    private T animal;

    public T getAnimal() { return animal; }
    public void setAnimal(T animal) { this.animal = animal; }

    // 기본 생성자
    public RabbitFarm() {}

    // 매개변수가 있는 생성자
    public RabbitFarm(T animal) { this.animal = animal; }
}
```

`T extends Rabbit`은 "`T`에는 `Rabbit` 또는 `Rabbit`의 하위 클래스만 올 수 있다"는 뜻이다.

```java
// RabbitFarm<Mammal> farm = new RabbitFarm<>();   // 컴파일 오류: Mammal은 Rabbit의 하위 클래스가 아니다

RabbitFarm<Rabbit> farm1 = new RabbitFarm<>();
RabbitFarm<Bunny> farm2 = new RabbitFarm<>();
RabbitFarm<DrunkenBunny> farm3 = new RabbitFarm<>();

// farm2.setAnimal(new Rabbit());   // 컴파일 오류: farm2는 Bunny 농장이고, Rabbit은 Bunny의 부모이다

farm2.setAnimal(new DrunkenBunny()); // 가능: DrunkenBunny는 Bunny의 자식이므로 Bunny로 취급할 수 있다
farm2.getAnimal().cry();             // 출력: ㅂ...ㄴ...ㅂ..ㄴ...나니...당...근...
```

마지막 줄은 `Bunny` 타입으로 꺼냈지만 실제 객체는 `DrunkenBunny`이므로, 오버라이드된 `DrunkenBunny`의 `cry()`가 실행된다.

### ❓ Q6. 기본 생성자와 매개변수 생성자를 왜 따로 만들었을까?

> 강사님이 치는 대로 따라 썼는데, 그냥 보여주려는 용도인지 궁금했다.

**A.** 보여주기용이 아니다. 두 가지 이유가 있다.

**① 생성자를 하나라도 직접 쓰면 기본 생성자는 자동으로 만들어지지 않는다.**
생성자를 아예 안 쓰면 자바가 빈 기본 생성자를 몰래 만들어 준다. 그런데 매개변수 생성자를 직접 쓰는 순간 그 자동 생성이 사라진다. `new RabbitFarm<>()`처럼 빈 채로 만들려면 `public RabbitFarm() {}`를 직접 적어야 한다.

**② 실제로 수업 코드에서 둘 다 쓴다.**

```java
// Application01: 기본 생성자 (농장부터 만들고 토끼는 나중에 넣는다)
RabbitFarm<Bunny> farm2 = new RabbitFarm<>();
farm2.setAnimal(drunkenBunny);

// Application02: 매개변수 생성자 (만들면서 토끼를 바로 넣는다)
new RabbitFarm<Rabbit>(new Rabbit())
```

| 생성자 | 만든 직후 `animal` | 언제 쓰나 |
|---|---|---|
| `RabbitFarm()` | `null` | 값을 아직 모르거나 나중에 `setAnimal`로 넣을 때 |
| `RabbitFarm(T animal)` | 넘긴 값 | 생성과 동시에 값을 채우고 싶을 때 |

### ❓ Q7. `new RabbitFarm<Rabbit>(new Rabbit())`는 어떤 생성자를 쓴 걸까? 깔끔하게 쓰면?

> 강사님이 일부러 어렵게 썼다고 했는데, 매개변수 생성자가 쓰인 게 맞는지, 그리고 줄여 쓰면 어떻게 되는지 궁금했다.

**A.** **괄호 안에 값을 넘기고 있으면 매개변수 생성자**이다.

```java
new RabbitFarm<Rabbit>()               // 기본 생성자 (괄호 안이 비어 있음)
new RabbitFarm<Rabbit>(new Rabbit())   // 매개변수 생성자 (값을 넘김)
```

한 줄에 `new`가 두 번 나오는데, 안쪽 `new Rabbit()`은 `Rabbit`의 생성자이고 바깥쪽이 `RabbitFarm`의 매개변수 생성자이다. 생성자 인자로 `Rabbit`을 넘기고 있어서 컴파일러가 `T`가 `Rabbit`임을 **스스로 추론**할 수 있으므로 `<Rabbit>`은 생략할 수 있다.

```java
wildcardFarm.anyType(new RabbitFarm<>(new Rabbit()));   // 깔끔한 형태

// 변수로 나누면 더 읽기 쉽다
RabbitFarm<Rabbit> farm = new RabbitFarm<>(new Rabbit());
wildcardFarm.anyType(farm);
```

> **주의: 수업에서 타입을 일부러 풀어 쓴 이유**
> 아래 와일드카드 예제의 `superType(new RabbitFarm<DrunkenBunny>(new DrunkenBunny()))`는 컴파일 오류가 나야 하는 예제이다. 그런데 `<DrunkenBunny>`를 `<>`로 줄이면 컴파일러가 `T`를 `Bunny`로 맞춰 추론해서 **오류 없이 통과한다.** 와일드카드가 막는 모습을 눈으로 확인하려고 타입을 명시한 것이므로, 이 예제에서는 풀어 쓴 형태가 맞다.

---

## 8. 와일드카드(`?`)

제네릭 클래스의 객체를 **메서드의 매개변수로 받을 때**, 그 객체의 타입 변수를 제한하는 문법이다.

| 문법 | 이름 | 허용 범위 |
|---|---|---|
| `<?>` | 제한 없음 | 모든 타입 |
| `<? extends Type>` | 상한 제한 | `Type` 또는 그 **하위 클래스(subclass)** |
| `<? super Type>` | 하한 제한 | `Type` 또는 그 **상위 클래스(superclass)** |

```java
public class WildcardFarm {
    public void anyType(RabbitFarm<?> farm) {
        farm.getAnimal().cry();
    }

    public void extendsType(RabbitFarm<? extends Bunny> farm) {
        farm.getAnimal().cry();
    }

    public void superType(RabbitFarm<? super Bunny> farm) {
        farm.getAnimal().cry();
    }
}
```

클래스 계층에서 부모가 위, 자식이 아래라고 생각하면 그림으로 이해하기 쉽다.

```
Rabbit                ▲  <? super Bunny>: Bunny와 그 위쪽(Rabbit)
  └─ Bunny            ●  기준
      └─ DrunkenBunny ▼  <? extends Bunny>: Bunny와 그 아래쪽(DrunkenBunny)
```

### 어떤 호출이 가능한가 (타입을 명시해서 넘겼을 때)

| 전달하는 객체 | `anyType`<br>`<?>` | `extendsType`<br>`<? extends Bunny>` | `superType`<br>`<? super Bunny>` |
|---|:---:|:---:|:---:|
| `RabbitFarm<Rabbit>` | ✅ | ❌ | ✅ |
| `RabbitFarm<Bunny>` | ✅ | ✅ | ✅ |
| `RabbitFarm<DrunkenBunny>` | ✅ | ✅ | ❌ |

```java
WildcardFarm wildcardFarm = new WildcardFarm();

wildcardFarm.anyType(new RabbitFarm<Rabbit>(new Rabbit()));                  // 모두 가능
wildcardFarm.extendsType(new RabbitFarm<DrunkenBunny>(new DrunkenBunny()));  // Bunny 이하만 가능
wildcardFarm.superType(new RabbitFarm<Rabbit>(new Rabbit()));                // Bunny 이상만 가능
```

> `RabbitFarm<?>`처럼 `?`만 써도 `farm.getAnimal().cry()`가 컴파일되는 이유는, `RabbitFarm`이 이미 `T extends Rabbit`으로 제한되어 있어서 `?`가 무엇이든 최소한 `Rabbit`이라는 것을 컴파일러가 알기 때문이다.
>
> 또 `<? super Bunny>`라고 써도 `RabbitFarm<Mammal>`은 애초에 만들 수 없으므로, 실제로 올 수 있는 건 `Rabbit`과 `Bunny` 두 가지뿐이다.

---

## 9. 한눈에 정리

| 개념 | 핵심 |
|---|---|
| `Object` | 모든 클래스의 최상위 부모. 뭐든 담지만 꺼낼 때 형변환이 필요하고, 잘못 쓰면 런타임 오류가 난다 |
| 제네릭 | 타입을 클래스 작성 시점이 아니라 **사용 시점에 지정**해서, 컴파일 단계에서 타입을 검사한다 |
| `<>` | 타입을 지정하는 자리. 기본 자료형은 불가하고 래퍼 클래스를 쓴다 |
| `T` | 타입 변수. 값이 아니라 **타입**을 담는다 |
| `T extends Rabbit` | `T`에 올 수 있는 타입을 `Rabbit` 계열로 제한한다 |
| 생성자 | 매개변수 생성자를 만들면 기본 생성자는 자동 생성되지 않는다 |
| `extends` / `implements` | 클래스 상속 / 인터페이스 구현 |
| `<?>` | 제한 없음 |
| `<? extends Type>` | `Type` 이하(하위 클래스)만 |
| `<? super Type>` | `Type` 이상(상위 클래스)만 |

### 오늘의 결론

제네릭은 **"클래스는 하나만 만들고, 타입은 쓸 때 정하되, 잘못된 타입은 컴파일 단계에서 막아주는 장치"** 이다.
